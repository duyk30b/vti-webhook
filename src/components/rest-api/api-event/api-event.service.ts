import { Injectable } from '@nestjs/common'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'
import { EventCreateBody, EventUpdateBody } from './request'
import { EventPaginationQuery } from './request/event-pagination.query'
import { EventRepository } from 'src/mongo/repository/event/event.repository'

@Injectable()
export class ApiEventService {
	constructor(private readonly eventRepository: EventRepository) { }

	async pagination(query: EventPaginationQuery) {
		return await this.eventRepository.pagination({
			page: query.page,
			limit: query.limit,
		})
	}

	async getAll() {
		const events = await this.eventRepository.findMany({})
		return events
	}

	async getOne(id: string) {
		const event = await this.eventRepository.findOne({ id }, { hook: false })
		if (!event) {
			throw new BusinessException('error.Event.NotFound')
		}
		return event
	}

	async createOne(body: EventCreateBody) {
		const event = await this.eventRepository.insertOne(body)
		return event
	}

	async updateOne(id: string, body: EventUpdateBody) {
		const event = await this.eventRepository.updateOne({ id }, body)
		if (!event) {
			throw new BusinessException('error.Event.NotFound')
		}
		return event
	}
}
