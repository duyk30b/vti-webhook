import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IdMongoParam } from 'src/common/swagger/id-param.swagger'
import { ApiHookService } from './api-hook.service'
import { HookCreateBody, HookUpdateBody } from './request'
import { HookPaginationQuery } from './request/hook-pagination.query'

@ApiTags('Hooks')
@Controller('hook')
export class ApiHookController {
	constructor(private readonly apiHookService: ApiHookService) { }

	@Get('pagination')
	pagination(@Query() query: HookPaginationQuery) {
		return this.apiHookService.pagination(query)
	}

	@Get('details/:id')
	async details(@Param() { id }: IdMongoParam) {
		return await this.apiHookService.getOne(id)
	}

	@Post('create')
	async create(@Body() body: HookCreateBody) {
		return await this.apiHookService.createOne(body)
	}

	@Patch('update/:id')
	async update(@Param() { id }: IdMongoParam, @Body() body: HookUpdateBody) {
		return await this.apiHookService.updateOne(id, body)
	}

	@Delete('delete/:id')
	async delete(@Param() { id }: IdMongoParam) {
		return await this.apiHookService.deleteOne(id)
	}
}
