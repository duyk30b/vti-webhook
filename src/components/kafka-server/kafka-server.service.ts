import { Injectable } from '@nestjs/common'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'
import { ProtocolType } from 'src/database/common/enum'
import { EventHistoryEntity } from 'src/database/entities/event-history.entity'
import { HookEntity } from 'src/database/entities/hook.entity'
import { EventHistoryRepository } from 'src/database/repository/event-history/event-history.repository'
import { EventRepository } from 'src/database/repository/event/event.repository'
import { HookRepository } from 'src/database/repository/hook/hook.repository'
import { AxiosService } from 'src/modules/axios/axios.service'
import { ProcessEventRequest } from './request/process-event.request'

@Injectable()
export class KafkaServerService {
	constructor(
		private readonly hookRepository: HookRepository,
		private readonly eventRepository: EventRepository,
		private readonly eventHistoryRepository: EventHistoryRepository,
		private readonly axiosService: AxiosService
	) { }

	async processEvent({ code, data }: ProcessEventRequest) {
		const event = await this.eventRepository.findOne({ code })
		if (!event) throw new BusinessException('error.Event.NotFound')

		const hooks = await this.hookRepository.findMany({ eventId: event.id })
		if (!hooks.length) return

		// for REST API
		const restPromise = hooks
			.filter((i) => i.protocolType === ProtocolType.RestAPI)
			.map((i: HookEntity) => this.axiosService.post({
				url: i.url,
				data,
				config: { headers: i.header },
			}))

		if (!restPromise.length) return
		const restResult = await Promise.allSettled(restPromise)

		const snapEventHistories: EventHistoryEntity[] = []
		restResult.forEach((item, index) => {
			const history = new EventHistoryEntity()
			history.code = event.code
			history.name = event.name
			history.protocolType = hooks[index].protocolType
			history.request = {
				url: hooks[index].url,
				headers: hooks[index].header,
			}

			if (item.status === 'fulfilled') {
				history.success = true
				history.response = item.value
			}
			else if (item.status === 'rejected') {
				history.success = false
				history.response = {
					status: item.reason.response?.status,
					message: item.reason.message,
					data: item.reason.response?.data,
				}
			}
			snapEventHistories.push(history)
		})

		await this.eventHistoryRepository.insertMany(snapEventHistories)
	}
}
