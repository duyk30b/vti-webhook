import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ProtocolType } from 'src/database/common/enum'
import { BaseSchema } from '../../base.schema'
import { Event, EventType } from '../event/event.schema'

@Schema({ collection: 'hooks', timestamps: false })
export class Hook extends BaseSchema {
	@Prop({ type: Types.ObjectId, required: true, ref: Event.name })
	_event_id: Types.ObjectId

	@Prop()
	name: string

	@Prop({ type: String, enum: ProtocolType })
	protocolType: ProtocolType

	@Prop()
	url: string

	@Prop({ type: Object })
	header: Record<string, any>
}

const HookSchema = SchemaFactory.createForClass(Hook)
HookSchema.virtual('event', {
	ref: 'Event',
	localField: '_event_id',
	foreignField: '_id',
	justOne: true,
})
HookSchema.virtual('eventId').get(function () {
	return this._event_id.toHexString()
})

export { HookSchema }

export type HookType = Omit<Hook, keyof Document<Hook>> & {
	id: string
	eventId: string
	event: EventType
}