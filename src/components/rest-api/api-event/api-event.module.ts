import { Module } from '@nestjs/common'
import { ApiEventController } from './api-event.controller'
import { ApiEventService } from './api-event.service'

@Module({
	imports: [],
	controllers: [ApiEventController],
	providers: [ApiEventService],
})
export class ApiEventModule { }
