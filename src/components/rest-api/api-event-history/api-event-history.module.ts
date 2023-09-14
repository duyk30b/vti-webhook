import { Module } from '@nestjs/common'
import { KafkaClientModule } from 'src/modules/kafka/kafka-client.module'
import { ApiEventHistoryController } from './api-event-history.controller'
import { ApiEventHistoryService } from './api-event-history.service'

@Module({
	imports: [KafkaClientModule],
	controllers: [ApiEventHistoryController],
	providers: [ApiEventHistoryService],
})
export class ApiEventHistoryModule { }
