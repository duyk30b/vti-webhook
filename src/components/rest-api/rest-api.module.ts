import { Module } from '@nestjs/common'
import { ApiEventHistoryModule } from './api-event-history/api-event-history.module'
import { ApiEventModule } from './api-event/api-event.module'
import { ApiHookModule } from './api-hook/api-hook.module'

@Module({
	imports: [
		ApiEventModule,
		ApiHookModule,
		ApiEventHistoryModule,
	],
	providers: [],
})
export class RestApiModule { }
