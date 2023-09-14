import { Module } from '@nestjs/common'
import { NatsServerController } from './nats-server.controller'
import { NatsServerService } from './nats-server.service'

@Module({
	imports: [],
	controllers: [NatsServerController],
	providers: [NatsServerService],
})
export class NatsServerModule { }
