import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { KafkaTopic } from './kafka.config'

@Injectable()
export class KafkaClientService {
	private readonly logger = new Logger(KafkaClientService.name)

	constructor(@Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka) { }

	async onModuleInit() {
		try {
			await this.kafkaClient.connect()
		} catch (error) {
			this.logger.error(error)
		}
	}

	async sendMessage(topicName: string, data: Record<string, any>, version = 1) {
		const message = {
			...data,
			createTime: new Date().getTime(),
			version,
		}
		const response = this.kafkaClient.emit(topicName, message)
		return await lastValueFrom(response)
	}

	async sendTopicWebhookProcessEvent(data: { code: string, data: Record<string, any> }) {
		return await this.sendMessage(KafkaTopic.WEBHOOK_PROCESS_EVENT, data)
	}
}
