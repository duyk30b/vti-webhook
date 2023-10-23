import { ClassSerializerInterceptor, Logger, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { KafkaOptions, NatsOptions } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { BusinessExceptionFilter } from './core/exception-filters/business-exception.filter'
import { UnknownExceptionFilter } from './core/exception-filters/unknown-exception.filter'
import { ValidationException, ValidationExceptionFilter } from './core/exception-filters/validation-exception.filter'
import { AccessLogInterceptor } from './core/interceptor/access-log.interceptor'
import { TransformResponseInterceptor } from './core/interceptor/transform-response.interceptor'
import { KafkaConfig } from './modules/kafka/kafka.config'
import { NatsConfig } from './modules/nats/nats.config'

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

	app.connectMicroservice<NatsOptions>(NatsConfig, { inheritAppConfig: true })
	// app.connectMicroservice<KafkaOptions>(KafkaConfig, { inheritAppConfig: true })

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
		logger.debug(`🚀 ===== [API] Server document: http://${APP_HOST}:${APP_CONTAINER_PORT}${API_PATH}/swagger-docs =====`)
		logger.debug(`🚀 ===== [SQL] Database: jdbc:postgresql://${DATABASE_POSTGRES_HOST}:${DATABASE_POSTGRES_PORT}/${DATABASE_NAME} =====`)
	})
	await app.startAllMicroservices()
}

bootstrap()
