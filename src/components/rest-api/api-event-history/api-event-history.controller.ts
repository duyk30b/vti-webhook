import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiEventHistoryService } from './api-event-history.service'
import { EventHistoryPaginationQuery } from './request/event-history-pagination.query'

@ApiTags('History')
@Controller('history')
export class ApiEventHistoryController {
	constructor(private readonly apiEventHistoryService: ApiEventHistoryService) { }

	@Get('pagination')
	pagination(@Query() query: EventHistoryPaginationQuery) {
		return this.apiEventHistoryService.pagination(query)
	}
}
