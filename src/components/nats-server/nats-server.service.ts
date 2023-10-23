import { Injectable } from '@nestjs/common'
import { EventBody, EventRegisterBody } from './request'
import { HookRepository } from 'src/mongo/repository/hook/hook.repository'
import { EventRepository } from 'src/mongo/repository/event/event.repository'
import { EventType } from 'src/mongo/repository/event/event.schema'

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
		const eventMap: Record<string, EventType> = {}
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
			await this.eventRepository.updateOne({ id: eventMap[event.code].id }, event)
		}

		return {
			created: eventsCreate.length,
			updated: eventsUpdate.length,
		}
	}
}
