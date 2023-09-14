import { Injectable } from '@nestjs/common'
import { HookRepository } from 'src/database/repository/hook/hook.repository'
import { HookCreateBody, HookPaginationQuery, HookUpdateBody } from './request'

@Injectable()
export class ApiHookService {
	constructor(private readonly hookRepository: HookRepository) { }

	async pagination(query: HookPaginationQuery) {
		return await this.hookRepository.pagination({
			page: query.page,
			limit: query.limit,
		})
	}

	async getOne(id: number) {
		const customer = await this.hookRepository.findOne({ id }, { event: true })
		return customer
	}

	async createOne(body: HookCreateBody) {
		return await this.hookRepository.insertOne(body)
	}

	async updateOne(id: number, body: HookUpdateBody) {
		const { affected } = await this.hookRepository.update({ id }, body)
		if (affected !== 1) throw new Error('UpdateFailed')
		return await this.hookRepository.findOne({ id }, { event: true })
	}

	async delete(id: number) {
		const response = await this.hookRepository.delete({ id })
		if (response.affected == 0) throw new Error('DeleteFailed')
		return response
	}
}
