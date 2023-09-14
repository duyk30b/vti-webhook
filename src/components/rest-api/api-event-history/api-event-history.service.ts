import { Injectable } from '@nestjs/common'
import { EventHistoryRepository } from 'src/database/repository/event-history/event-history.repository'
import { KafkaClientService } from 'src/modules/kafka/kafka-client.service'
import { EventHistoryPaginationQuery } from './request/event-history-pagination.query'

@Injectable()
export class ApiEventHistoryService {
	constructor(
		private readonly eventHistoryRepository: EventHistoryRepository,
		private readonly kafkaClientService: KafkaClientService
	) { }

	async pagination(query: EventHistoryPaginationQuery) {
		return await this.eventHistoryRepository.pagination({
			page: query.page,
			limit: query.limit,
		})
	}
}
