import { Injectable } from '@nestjs/common'
import { HookCreateBody, HookPaginationQuery, HookUpdateBody } from './request'
import { HookRepository } from 'src/mongo/repository/hook/hook.repository'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'

@Injectable()
export class ApiHookService {
	constructor(private readonly hookRepository: HookRepository) { }

	async pagination(query: HookPaginationQuery) {
		const result = await this.hookRepository.pagination({
			page: query.page,
			limit: query.limit,
			relation: { event: true },
		})
		return result
	}

	async getOne(id: string) {
		const hook = await this.hookRepository.findOne({ id }, { event: true })
		return hook
	}

	async createOne(body: HookCreateBody) {
		return await this.hookRepository.insertOne(body)
	}

	async updateOne(id: string, body: HookUpdateBody) {
		const hook = await this.hookRepository.updateOne({ id }, body)
		if (!hook) {
			throw new BusinessException('error.Hook.NotFound')
		}
		return hook
	}

	async deleteOne(id: string) {
		const deletedCount = await this.hookRepository.deleteOne({ id })
		if (deletedCount !== 1) {
			throw new BusinessException('error.Hook.NotFound')
		}
		return { deleted: deletedCount, id }
	}
}
