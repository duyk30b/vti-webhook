import { Injectable } from '@nestjs/common'
import { EventHistoryRepository } from 'src/database/repository/event-history/event-history.repository'
import { EventHistoryPaginationQuery } from './request/event-history-pagination.query'

@Injectable()
export class ApiEventHistoryService {
	constructor(private readonly eventHistoryRepository: EventHistoryRepository) { }

	async pagination(query: EventHistoryPaginationQuery) {
		return await this.eventHistoryRepository.pagination({
			page: query.page,
			limit: query.limit,
		})
	}
}
