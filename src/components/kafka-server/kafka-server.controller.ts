import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { KafkaTopic } from 'src/modules/kafka/kafka.config'
import { KafkaServerService } from './kafka-server.service'
import { ProcessEventRequest } from './request/process-event.request'

@Controller()
export class KafkaServerController {
	constructor(private readonly kafkaServerService: KafkaServerService) {
	}

	@MessagePattern(KafkaTopic.WEBHOOK_PROCESS_EVENT, Transport.KAFKA)
	async upsertEvent(@Payload() payload: ProcessEventRequest) {
		return this.kafkaServerService.processEvent(payload)
	}
}
