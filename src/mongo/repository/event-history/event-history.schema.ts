import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { ProtocolType } from 'src/mongo/common/enum'
import { BaseSchema } from '../../base.schema'

@Schema({ collection: 'eventHistories', timestamps: false })
export class EventHistory extends BaseSchema {
	@Prop()
	code: string

	@Prop()
	name: string

	@Prop({ type: String, enum: ProtocolType })
	protocolType: ProtocolType

	@Prop({ type: Object })
	request: { url?: string, headers?: any, body?: any }

	@Prop({ type: mongoose.Schema.Types.Mixed })
	response: Record<string, any>

	@Prop({ type: Boolean })
	success: boolean
}

const EventHistorySchema = SchemaFactory.createForClass(EventHistory)

export { EventHistorySchema }

export type EventHistoryType = Omit<EventHistory, keyof Document<EventHistory>> & {
	id: string
}