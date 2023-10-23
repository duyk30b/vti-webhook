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
		const filter = this.getFilterOptions(condition)

		let query = this.hookModel.find(filter).skip((page - 1) * limit).limit(limit)
		if (relation?.event) {
			query = query.populate(['event']) as any
		}

		const [docs, count] = await Promise.all([
			query.exec(),
			this.hookModel.countDocuments(filter),
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

	async findMany(condition: HookCondition): Promise<HookType[]> {
		const filter = this.getFilterOptions(condition)

		const docs = await this.hookModel.find(filter).exec()
		return docs.map((i) => i.toObject())
	}

	async insertOne<T extends Partial<HookType>>(data: NoExtraProperties<Partial<HookType>, T>): Promise<HookType> {
		data._event_id = new Types.ObjectId(data.eventId)
		const model = new this.hookModel(data)
		const doc = await model.save()
		return doc.toObject()
	}

	async insertMany<T extends Partial<HookType>>(data: NoExtraProperties<Partial<HookType>, T>[]): Promise<HookType[]> {
		const docs = await this.hookModel.insertMany(data)
		return docs.map((i: any) => i.toObject())
	}

	async updateOne<T extends Partial<HookType>>(
		condition: HookCondition,
		data: NoExtraProperties<Partial<HookType>, T>
	): Promise<HookType> {
		const filter = this.getFilterOptions(condition)
		const doc = await this.hookModel.findOneAndUpdate(filter, data, { new: true })
		return doc ? doc.toObject() : null
	}

	async deleteOne(condition: HookCondition): Promise<number> {
		const filter = this.getFilterOptions(condition)

		const result = await this.hookModel.deleteOne(filter)
		return result.deletedCount
	}

	async deleteMany(condition: HookCondition): Promise<any> {
		const filter = this.getFilterOptions(condition)

		return await this.hookModel.deleteMany(filter)
	}
}