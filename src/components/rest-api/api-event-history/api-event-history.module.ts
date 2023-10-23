import { Module } from '@nestjs/common'
import { ApiEventHistoryController } from './api-event-history.controller'
import { ApiEventHistoryService } from './api-event-history.service'

@Module({
	imports: [],
	controllers: [ApiEventHistoryController],
	providers: [ApiEventHistoryService],
})
export class ApiEventHistoryModule { }
