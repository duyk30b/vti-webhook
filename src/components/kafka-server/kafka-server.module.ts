import { Module } from '@nestjs/common'
import { KafkaServerController } from './kafka-server.controller'
import { KafkaServerService } from './kafka-server.service'

@Module({
	imports: [],
	controllers: [KafkaServerController],
	providers: [KafkaServerService],
})
export class KafkaServerModule { }
