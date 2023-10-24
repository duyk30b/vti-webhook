import { BootModule } from '@nestcloud/boot'
import { BOOT, CONSUL } from '@nestcloud/common'
import { ConsulModule } from '@nestcloud/consul'
import { ServiceModule } from '@nestcloud/service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
import { resolve } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NatsServerModule } from './components/nats-server/nats-server.module'
import { RestApiModule } from './components/rest-api/rest-api.module'
import { SqlModule } from './database/sql.module'
import { AxiosModule } from './modules/axios/axios.module'
import { KongGatewayModule } from './modules/kong-gateway/kong-gateway.module'
import { NatsClientModule } from './modules/nats/nats-client.module'
import { BullQueueModule } from './modules/redis/bull-queue/bull-queue.module'
import { RedisCacheModule } from './modules/redis/redis-cache/redis-cache.module'
import { MongoDbConnectModule } from './mongo/mongodb-connect.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`, '.env'],
			isGlobal: true,
		}),
		I18nModule.forRoot({
			fallbackLanguage: 'vi',
			loader: I18nJsonLoader,
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: true,
			},
			resolvers: [
				{ use: QueryResolver, options: ['lang', 'locale', 'l'] },
				new HeaderResolver(['lang', 'x-lang']),
			],
			typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
		}),
		BootModule.forRoot({ filePath: resolve(__dirname, '../config.yaml') }),
		ConsulModule.forRootAsync({ inject: [BOOT] }),
		ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
		KongGatewayModule.forRootAsync(),

		// SqlModule,
		MongoDbConnectModule,
		RedisCacheModule,
		BullQueueModule,

		NatsClientModule,
		AxiosModule,
		RestApiModule,
		NatsServerModule,
		// KafkaClientModule,
		// KafkaServerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
