import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { EventEntity } from 'src/database/entities/event.entity'
import { FindOptionsWhere, In, Repository, UpdateResult } from 'typeorm'
import { EventCondition, EventOrder } from './event.dto'

@Injectable()
export class EventRepository {
	constructor(@InjectRepository(EventEntity) private eventRepository: Repository<EventEntity>) { }

	getWhereOptions(condition: EventCondition = {}) {
		const where: FindOptionsWhere<EventEntity> = {}
		if (condition.id != null) where.id = condition.id
		if (condition.code != null) where.code = condition.code

		if (condition.ids) {
			if (condition.ids.length === 0) condition.ids.push(0)
			where.id = In(condition.ids)
		}
		if (condition.codes) {
			if (condition.codes.length === 0) condition.codes.push('')
			where.code = In(condition.codes)
		}

		return where
	}

	async pagination(options: {
		page: number,
		limit: number,
		order?: EventOrder,
		condition?: EventCondition
	}) {
		const { limit, page, condition, order } = options

		const [data, total] = await this.eventRepository.findAndCount({
			where: this.getWhereOptions(condition),
			order,
			take: limit,
			skip: (page - 1) * limit,
		})

		return { total, page, limit, data }
	}

	async findMany(condition?: EventCondition): Promise<EventEntity[]> {
		const where = this.getWhereOptions(condition)
		return await this.eventRepository.find({ where })
	}

	async findOne(condition: EventCondition): Promise<EventEntity> {
		const where = this.getWhereOptions(condition)
		return await this.eventRepository.findOne({ where })
	}

	async insertOne<T extends Partial<EventEntity>>(dto: NoExtraProperties<Partial<EventEntity>, T>): Promise<EventEntity> {
		const employee = this.eventRepository.create(dto)
		return this.eventRepository.save(employee)
	}

	async insertMany(dto: Partial<EventEntity>[]): Promise<EventEntity[]> {
		const events = this.eventRepository.create(dto)
		return this.eventRepository.save(events)
	}

	async update<T extends Partial<EventEntity>>(
		condition: EventCondition,
		dto: NoExtraProperties<Partial<Omit<EventEntity, 'id'>>, T>
	): Promise<UpdateResult> {
		const where = this.getWhereOptions(condition)
		return await this.eventRepository.update(where, dto)
	}
}
