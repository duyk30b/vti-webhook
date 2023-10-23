import { Global, Module } from '@nestjs/common'
import { ClientProxyFactory } from '@nestjs/microservices'
import { NatsClientService } from './nats-client.service'
import { NatsConfig } from './nats.config'
import { NatsClientAuthService } from './service/nats-client-auth.service'

@Global()
@Module({
	providers: [
		{
			provide: 'NATS_CLIENT_SERVICE',
			useFactory: () => {
				return ClientProxyFactory.create(NatsConfig)
			},
		},
		NatsClientService,
		NatsClientAuthService,
	],
	exports: [
		NatsClientService,
		NatsClientAuthService,
	],
})
export class NatsClientModule { }
