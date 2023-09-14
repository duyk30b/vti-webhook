import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IdParam } from 'src/common/swagger/id-param.swagger'
import { ApiEventService } from './api-event.service'
import { EventCreateBody, EventUpdateBody } from './request'
import { EventPaginationQuery } from './request/event-pagination.query'

@ApiTags('Events')
@Controller('event')
export class ApiEventController {
	constructor(private readonly apiEventService: ApiEventService) { }

	@Get('pagination')
	pagination(@Query() query: EventPaginationQuery) {
		return this.apiEventService.pagination(query)
	}

	@Get('all')
	async all() {
		return await this.apiEventService.getAll()
	}

	@Get('detail/:id')
	async detail(@Param() { id }: IdParam) {
		return await this.apiEventService.getOne(id)
	}

	@Post('create')
	async create(@Body() body: EventCreateBody) {
		return await this.apiEventService.createOne(body)
	}

	@Patch('update/:id')
	async update(@Param() { id }: IdParam, @Body() body: EventUpdateBody) {
		return await this.apiEventService.updateOne(+id, body)
	}
}
