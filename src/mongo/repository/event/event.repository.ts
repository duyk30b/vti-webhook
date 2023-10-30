import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { EventCondition, EventOrder } from './event.dto'
import { EventType } from './event.schema'

@Injectable()
export class EventRepository {
	constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>) { }

	getFilterOptions(condition: EventCondition = {}) {
		const filter: FilterQuery<Event> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		if (condition.code != null) filter.code = condition.code
		if (condition.codes != null) filter.code = { $in: condition.codes }

		return filter
	}

	async pagination(options: {
		page: number,
		limit: number,
		order?: EventOrder,
		condition?: EventCondition
	}) {
		const { limit, page, condition, order } = options
		const [docs, count] = await Promise.all([
			this.eventModel.find(condition).skip((page - 1) * limit).limit(limit).exec(),
			this.eventModel.countDocuments(condition),
		])
		const data: EventType[] = docs.map((i) => i.toObject())
		return { page, limit, data, count }
	}

	async findOne(condition: EventCondition, relation?: { hook?: boolean }): Promise<EventType> {
		const filter = this.getFilterOptions(condition)
		let query = this.eventModel.findOne(filter)
		if (relation?.hook) {
			query = query.populate(['hooks'])
		}
		const doc = await query
		return doc ? doc.toObject() : null
	}

	async findMany(condition: EventCondition): Promise<EventType[]> {
		const filter = this.getFilterOptions(condition)
		const docs = await this.eventModel.find(filter).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<EventType>>(data: NoExtraProperties<Partial<EventType>, T>): Promise<EventType> {
		const model = new this.eventModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<EventType>>(data: NoExtraProperties<Partial<EventType>, T>[]): Promise<EventType[]> {
		const hydratedDocument = await this.eventModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async updateOne<T extends Partial<EventType>>(
		condition: EventCondition,
		data: NoExtraProperties<Partial<EventType>, T>
	): Promise<EventType> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.eventModel.findOneAndUpdate(filter, data, { new: true })
		return doc ? doc.toObject() : null
	}

	async deleteMany(condition: EventCondition): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.eventModel.deleteMany(filter)
	}
}