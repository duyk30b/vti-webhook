import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import MongodbConfigService from './mongodb.config'
import { EventHistoryRepository } from './repository/event-history/event-history.repository'
import { EventHistory, EventHistorySchema } from './repository/event-history/event-history.schema'
import { EventRepository } from './repository/event/event.repository'
import { Event, EventSchema } from './repository/event/event.schema'
import { HookRepository } from './repository/hook/hook.repository'
import { Hook, HookSchema } from './repository/hook/hook.schema'

@Global()
@Module({
	imports: [
		MongooseModule.forRootAsync({ useClass: MongodbConfigService }),
		MongooseModule.forFeature([
			{ name: Event.name, schema: EventSchema },
			{ name: EventHistory.name, schema: EventHistorySchema },
			{ name: Hook.name, schema: HookSchema },
		]),
	],
	providers: [
		EventRepository,
		EventHistoryRepository,
		HookRepository,
	],
	exports: [
		EventRepository,
		EventHistoryRepository,
		HookRepository,
	],
})
export class MongoDbConnectModule { }
