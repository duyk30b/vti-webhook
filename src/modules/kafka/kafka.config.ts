import { registerAs } from '@nestjs/config'
import 'dotenv/config'

export const KafkaConfig = registerAs('nats', () => {
	return {
		BROKERS: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
		GROUP_ID: process.env.KAFKA_GROUP_ID || 'group-consumer-webhook',
	}
})

export const KafkaTopic = { WEBHOOK_PROCESS_EVENT: process.env.WEBHOOK_PROCESS_EVENT || 'webhook_process_event' }
