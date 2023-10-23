import { Injectable } from '@nestjs/common'
import { HookCreateBody, HookPaginationQuery, HookUpdateBody } from './request'
import { HookRepository } from 'src/mongo/repository/hook/hook.repository'

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
		// const { affected } = await this.hookRepository.update({ id }, body)
		// if (affected !== 1) throw new Error('UpdateFailed')
		// return await this.hookRepository.findOne({ id }, { event: true })
	}

	async delete(id: string) {
		// const response = await this.hookRepository.delete({ id })
		// if (response.affected == 0) throw new Error('DeleteFailed')
		// return response
	}
}
