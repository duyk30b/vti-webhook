import { Injectable } from '@nestjs/common'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'
import { EventRepository } from 'src/database/repository/event/event.repository'
import { EventCreateBody, EventUpdateBody } from './request'
import { EventPaginationQuery } from './request/event-pagination.query'

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
		const events = await this.eventRepository.findMany()
		return events
	}

	async getOne(id: number) {
		const event = await this.eventRepository.findOne({ id })
		if (!event) {
			throw new BusinessException('error.Event.NotFound')
		}
		return event
	}

	async createOne(body: EventCreateBody) {
		return await this.eventRepository.insertOne(body)
	}

	async updateOne(id: number, body: EventUpdateBody) {
		const { affected } = await this.eventRepository.update({ id }, body)
		if (affected !== 1) throw new Error('UpdateFailed')
		return await this.eventRepository.findOne({ id })
	}
}
