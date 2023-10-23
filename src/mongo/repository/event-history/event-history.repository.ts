import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { EventHistoryCondition } from './event-history.dto'
import { EventHistory, EventHistoryType } from './event-history.schema'

@Injectable()
export class EventHistoryRepository {
	constructor(@InjectModel(EventHistory.name) private readonly eventHistoryModel: Model<EventHistory>) { }

	getFilterOptions(condition: EventHistoryCondition = {}) {
		const filter: FilterQuery<EventHistory> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		if (condition.code != null) filter.code = condition.code
		if (condition.codes != null) filter.code = { $in: condition.codes }

		return filter
	}

	async findOneBy(condition: EventHistoryCondition): Promise<EventHistoryType> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.eventHistoryModel.findOne(filter)
		return doc ? doc.toObject() : null
	}

	async findManyBy(condition: any): Promise<EventHistoryType[]> {
		const docs = await this.eventHistoryModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<EventHistoryType>>(data: NoExtraProperties<Partial<EventHistoryType>, T>): Promise<EventHistoryType> {
		const model = new this.eventHistoryModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<EventHistoryType>>(data: NoExtraProperties<Partial<EventHistoryType>, T>[]): Promise<EventHistoryType[]> {
		const hydratedDocument = await this.eventHistoryModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: EventHistoryCondition): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.eventHistoryModel.deleteMany(filter)
	}
}