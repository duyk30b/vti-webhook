import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { ClientProxyFactory, Transport } from '@nestjs/microservices'
import * as fs from 'fs'
import { Partitioners } from 'kafkajs'
import * as path from 'path'
import { KafkaClientService } from './kafka-client.service'
import { KafkaConfig } from './kafka.config'

@Global()
@Module({
	imports: [ConfigModule.forFeature(KafkaConfig)],
	providers: [
		{
			provide: 'KAFKA_SERVICE',
			inject: [KafkaConfig.KEY],
			useFactory: (kafkaConfig: ConfigType<typeof KafkaConfig>) => {
				return ClientProxyFactory.create({
					transport: Transport.KAFKA,
					options: {
						client: {
							clientId: kafkaConfig.GROUP_ID + '-client',
							brokers: kafkaConfig.BROKERS,
							ssl: {
								rejectUnauthorized: false,
								ca: [fs.readFileSync(path.join(__dirname, '/../../cert/kafka.crt'), 'utf-8')],
								key: fs.readFileSync(path.join(__dirname, '/../../cert/kafka.key'), 'utf-8'),
								cert: fs.readFileSync(path.join(__dirname, '/../../cert/kafka.pem'), 'utf-8'),
							},
						},
						consumer: {
							groupId: kafkaConfig.GROUP_ID,
							allowAutoTopicCreation: true,
						},
						producer: {
							allowAutoTopicCreation: true,
							createPartitioner: Partitioners.LegacyPartitioner,
						},
					},
				})
			},
		},
		KafkaClientService,
	],
	exports: [KafkaClientService],
})
export class KafkaClientModule { }
