import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, Types } from 'mongoose'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { HookCondition, HookOrder } from './hook.dto'
import { Hook, HookType } from './hook.schema'

@Injectable()
export class HookRepository {
	constructor(@InjectModel(Hook.name) private readonly hookModel: Model<Hook>) { }

	getFilterOptions(condition: HookCondition = {}) {
		const filter: FilterQuery<Hook> = {}

		if (condition.id != null) filter._id = condition.id
		if (condition.ids != null) filter._id = { $in: condition.ids }

		if (condition.eventId != null) filter._event_id = condition.eventId
		if (condition.eventIds != null) filter._event_id = { $in: condition.eventIds }

		return filter
	}

	async pagination(options: {
		page: number,
		limit: number,
		order?: HookOrder,
		condition?: HookCondition
		relation?: { event: boolean }
	}) {
		const { limit, page, condition, order, relation } = options
		let query = this.hookModel.find(condition).skip((page - 1) * limit).limit(limit)
		if (relation?.event) {
			query = query.populate(['event']) as any
		}

		const [docs, count] = await Promise.all([
			query.exec(),
			this.hookModel.countDocuments(condition),
		])
		const data: HookType[] = docs.map((i) => i.toObject())
		return { page, limit, data, count }
	}

	async findOne(condition: HookCondition, relation?: { event: boolean }): Promise<HookType> {
		const filter = this.getFilterOptions(condition)

		let query = this.hookModel.findOne(filter)
		if (relation?.event) {
			query = query.populate(['event']) as any
		}
		const doc = await query
		return doc ? doc.toObject() : null
	}

	async findMany(condition: any): Promise<HookType[]> {
		const docs = await this.hookModel.find(condition).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<HookType>>(data: NoExtraProperties<Partial<HookType>, T>): Promise<HookType> {
		data._event_id = new Types.ObjectId(data.eventId)
		const model = new this.hookModel(data)
		const inventorySnap = await model.save()
		return inventorySnap.toObject()
	}

	async insertMany<T extends Partial<HookType>>(data: NoExtraProperties<Partial<HookType>, T>[]): Promise<HookType[]> {
		const hydratedDocument = await this.hookModel.insertMany(data)
		return hydratedDocument.map((i: any) => i.toObject())
	}

	async deleteMany(condition: HookCondition): Promise<any> {
		const filter = this.getFilterOptions(condition)
		return await this.hookModel.deleteMany(filter)
	}
}