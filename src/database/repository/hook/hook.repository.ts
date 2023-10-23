// import { Injectable } from '@nestjs/common'
// import { InjectRepository } from '@nestjs/typeorm'
// import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
// import { HookEntity } from 'src/database/entities/hook.entity'
// import { FindOptionsWhere, In, Repository, UpdateResult } from 'typeorm'
// import { HookCondition, HookOrder } from './hook.dto'

// @Injectable()
// export class HookRepository {
// 	constructor(@InjectRepository(HookEntity) private hookRepository: Repository<HookEntity>) { }

// 	getWhereOptions(condition: HookCondition = {}) {
// 		const where: FindOptionsWhere<HookEntity> = {}
// 		if (condition.id != null) where.id = condition.id
// 		if (condition.eventId != null) where.eventId = condition.eventId

// 		if (condition.ids) {
// 			if (condition.ids.length === 0) condition.ids.push(0)
// 			where.id = In(condition.ids)
// 		}
// 		if (condition.eventIds) {
// 			if (condition.eventIds.length === 0) condition.eventIds.push(0)
// 			where.eventId = In(condition.eventIds)
// 		}

// 		return where
// 	}

// 	async pagination(options: {
// 		page: number,
// 		limit: number,
// 		order?: HookOrder,
// 		condition?: HookCondition
// 	}) {
// 		const { limit, page, condition, order } = options

// 		const [data, total] = await this.hookRepository.findAndCount({
// 			where: this.getWhereOptions(condition),
// 			relations: { event: true },
// 			relationLoadStrategy: 'join',
// 			order,
// 			take: limit,
// 			skip: (page - 1) * limit,
// 		})

// 		return { total, page, limit, data }
// 	}

// 	async findMany(condition: HookCondition, relation?: { event?: boolean }): Promise<HookEntity[]> {
// 		const where = this.getWhereOptions(condition)
// 		return await this.hookRepository.find({
// 			relations: { event: !!relation?.event },
// 			relationLoadStrategy: 'join',
// 			where,
// 		})
// 	}

// 	async findOne(condition: HookCondition, relation?: { event?: boolean }): Promise<HookEntity> {
// 		const where = this.getWhereOptions(condition)
// 		return await this.hookRepository.findOne({
// 			relations: { event: !!relation?.event },
// 			relationLoadStrategy: 'join',
// 			where,
// 		})
// 	}

// 	async insertOne<T extends Partial<HookEntity>>(dto: NoExtraProperties<Partial<HookEntity>, T>): Promise<HookEntity> {
// 		const employee = this.hookRepository.create(dto)
// 		return this.hookRepository.save(employee)
// 	}

// 	async update<T extends Partial<HookEntity>>(
// 		condition: HookCondition,
// 		dto: NoExtraProperties<Partial<Omit<HookEntity, 'id'>>, T>
// 	): Promise<UpdateResult> {
// 		const where = this.getWhereOptions(condition)
// 		return await this.hookRepository.update(where, dto)
// 	}

// 	async delete(condition: HookCondition) {
// 		const where = this.getWhereOptions(condition)
// 		return await this.hookRepository.delete(where)
// 	}
// }
