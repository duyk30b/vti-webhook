import { Injectable } from '@nestjs/common'
import { EventEntity } from 'src/database/entities/event.entity'
import { EventRepository } from 'src/database/repository/event/event.repository'
import { HookRepository } from 'src/database/repository/hook/hook.repository'
import { EventBody, EventRegisterBody } from './request'

@Injectable()
export class NatsServerService {
	constructor(
		private readonly hookRepository: HookRepository,
		private readonly eventRepository: EventRepository
	) { }

	async pong(data: any) {
		return {
			meta: data,
			data: {
				message: 'webhook-service: pong',
				time: Date.now(),
			},
		}
	}

	async registerEvent({ data }: EventRegisterBody) {
		const codes = data.map((i) => i.code)
		const events = await this.eventRepository.findMany({ codes })
		const eventMap: Record<string, EventEntity> = {}
		events.forEach((e) => eventMap[e.code] = e)

		const eventsCreate: EventBody[] = []
		const eventsUpdate: EventBody[] = []

		data.forEach((item) => {
			const rootEvent = eventMap[item.code]
			if (!rootEvent) {
				eventsCreate.push(item)
			} else {
				if (rootEvent.name != item.name || rootEvent.description != item.description) {
					eventsUpdate.push(item)
				}
			}
		})

		await this.eventRepository.insertMany(eventsCreate)
		for (let i = 0; i < eventsUpdate.length; i++) {
			const event = eventsUpdate[i]
			await this.eventRepository.update({ id: eventMap[event.code].id }, event)
		}

		return {
			created: eventsCreate.length,
			updated: eventsUpdate.length,
		}
	}
}
