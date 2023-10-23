// import { Injectable } from '@nestjs/common'
// import { InjectRepository } from '@nestjs/typeorm'
// import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
// import { EventHistoryEntity } from 'src/database/entities/event-history.entity'
// import { FindOptionsWhere, In, Repository } from 'typeorm'
// import { EventHistoryCondition, EventHistoryOrder } from './event-history.dto'

// @Injectable()
// export class EventHistoryRepository {
// 	constructor(@InjectRepository(EventHistoryEntity) private eventRepository: Repository<EventHistoryEntity>) { }

// 	getWhereOptions(condition: EventHistoryCondition = {}) {
// 		const where: FindOptionsWhere<EventHistoryEntity> = {}
// 		if (condition.id != null) where.id = condition.id
// 		if (condition.success != null) where.success = condition.success

// 		if (condition.ids) {
// 			if (condition.ids.length === 0) condition.ids.push(0)
// 			where.id = In(condition.ids)
// 		}
// 		if (condition.codes) {
// 			if (condition.codes.length === 0) condition.codes.push(0)
// 			where.code = In(condition.codes)
// 		}

// 		return where
// 	}

// 	async pagination(options: {
// 		page: number,
// 		limit: number,
// 		order?: EventHistoryOrder,
// 		condition?: EventHistoryCondition
// 	}) {
// 		const { limit, page, condition, order } = options

// 		const [data, total] = await this.eventRepository.findAndCount({
// 			where: this.getWhereOptions(condition),
// 			order,
// 			take: limit,
// 			skip: (page - 1) * limit,
// 		})

// 		return { total, page, limit, data }
// 	}

// 	async findOne(condition: EventHistoryCondition): Promise<EventHistoryEntity> {
// 		const where = this.getWhereOptions(condition)
// 		return await this.eventRepository.findOne({ where })
// 	}

// 	async insertOne<T extends Partial<EventHistoryEntity>>(dto: NoExtraProperties<Partial<EventHistoryEntity>, T>): Promise<EventHistoryEntity> {
// 		const employee = this.eventRepository.create(dto)
// 		return this.eventRepository.save(employee)
// 	}

// 	async insertMany(dto: Partial<EventHistoryEntity>[]): Promise<EventHistoryEntity[]> {
// 		const employees = this.eventRepository.create(dto)
// 		return this.eventRepository.save(employees)
// 	}
// }
