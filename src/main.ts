import { ClassSerializerInterceptor, Logger, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { KafkaOptions, NatsOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import { Partitioners } from 'kafkajs'
import * as path from 'path'
import { AppModule } from './app.module'
import { BusinessExceptionFilter } from './core/exception-filters/business-exception.filter'
import { UnknownExceptionFilter } from './core/exception-filters/unknown-exception.filter'
import { ValidationException, ValidationExceptionFilter } from './core/exception-filters/validation-exception.filter'
import { AccessLogInterceptor } from './core/interceptor/access-log.interceptor'
import { TransformResponseInterceptor } from './core/interceptor/transform-response.interceptor'
import { KafkaConfig } from './modules/kafka/kafka.config'
import { NATS_SERVERS, NatsService } from './modules/nats/nats.config'

async function bootstrap() {
	const logger = new Logger('bootstrap')
	const app = await NestFactory.create(AppModule)
	app.useLogger(['log', 'error', 'warn', 'debug', 'verbose'])
	app.enableCors()
	app.useGlobalInterceptors(
		new AccessLogInterceptor(),
		new ClassSerializerInterceptor(app.get(Reflector), {
			excludeExtraneousValues: true,
			exposeUnsetFields: false,
		}),
		new TransformResponseInterceptor()
	)

	app.useGlobalFilters(
		new UnknownExceptionFilter(),
		new BusinessExceptionFilter(),
		new ValidationExceptionFilter()
	)

	app.useGlobalPipes(new ValidationPipe({
		validationError: { target: false, value: true },
		skipMissingProperties: true, // no validate field undefined
		whitelist: true, // no field not in DTO
		forbidNonWhitelisted: true, // exception when field not in DTO
		transform: true, // use for DTO
		transformOptions: {
			excludeExtraneousValues: false, // exclude field not in class DTO => no
			exposeUnsetFields: false, // expose field undefined in DTO => no
		},
		exceptionFactory: (errors: ValidationError[] = []) => new ValidationException(errors),
	}))

	app.connectMicroservice<NatsOptions>(
		{
			transport: Transport.NATS,
			options: {
				servers: NATS_SERVERS,
				queue: NatsService.WEBHOOK,
			},
		},
		{ inheritAppConfig: true }
	)

	app.connectMicroservice<KafkaOptions>(
		{
			transport: Transport.KAFKA,
			options: {
				client: {
					clientId: KafkaConfig().GROUP_ID + '-client',
					brokers: KafkaConfig().BROKERS,
					ssl: {
						rejectUnauthorized: false,
						ca: [fs.readFileSync(path.join(__dirname, './cert/kafka.crt'), 'utf-8')],
						key: fs.readFileSync(path.join(__dirname, './cert/kafka.key'), 'utf-8'),
						cert: fs.readFileSync(path.join(__dirname, './cert/kafka.pem'), 'utf-8'),
					},
				},
				consumer: {
					groupId: KafkaConfig().GROUP_ID,
					allowAutoTopicCreation: true,
				},
				producer: {
					allowAutoTopicCreation: true,
					createPartitioner: Partitioners.LegacyPartitioner,
				},
			},
		},
		{ inheritAppConfig: true }
	)

	const configService = app.get(ConfigService)
	const NODE_ENV = configService.get<string>('NODE_ENV') || 'local'
	const APP_HOST = configService.get<string>('APP_HOST') || 'localhost'
	const APP_CONTAINER_PORT = configService.get<string>('APP_CONTAINER_PORT')
	const API_PATH = configService.get<string>('API_PATH')

	const DATABASE_POSTGRES_HOST = configService.get<string>('DATABASE_POSTGRES_HOST')
	const DATABASE_POSTGRES_PORT = configService.get<string>('DATABASE_POSTGRES_PORT')
	const DATABASE_NAME = configService.get<string>('DATABASE_NAME')

	app.setGlobalPrefix(API_PATH)

	if (NODE_ENV !== 'production') {
		const options = new DocumentBuilder()
			.setTitle('API docs')
			.setVersion('1.0')
			.addBearerAuth(
				{ type: 'http', description: 'Access token' },
				'access-token'
			)
			.build()
		const document = SwaggerModule.createDocument(app, options)
		SwaggerModule.setup(
			`${API_PATH}/swagger-docs`,
			app,
			document,
			{ swaggerOptions: { persistAuthorization: true } }
		)
	}

	await app.listen(3000, () => {
		logger.debug(`🚀 ===== [API] Server document: http://${APP_HOST}:${APP_CONTAINER_PORT}/api/v1/webhook/swagger-docs =====`)
		logger.debug(`🚀 ===== [SQL] Database: jdbc:postgresql://${DATABASE_POSTGRES_HOST}:${DATABASE_POSTGRES_PORT}/${DATABASE_NAME} =====`)
	})
	await app.startAllMicroservices()
}

bootstrap()
