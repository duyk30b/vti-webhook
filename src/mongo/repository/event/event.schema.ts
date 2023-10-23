import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from '../../base.schema'

@Schema({ collection: 'events', timestamps: false })
export class Event extends BaseSchema {
	@Prop({ type: String, required: true, unique: true })
	code: string

	@Prop()
	name: string

	@Prop()
	description: string
}

const EventSchema = SchemaFactory.createForClass(Event)
EventSchema.virtual('hooks', {
	ref: 'Hook',
	localField: '_id',
	foreignField: '_event_id',
})

export { EventSchema }

export type EventType = Omit<Event, keyof Document<Event>> & {
	id: string
}