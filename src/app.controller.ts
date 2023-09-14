import { Controller, Get, Post } from '@nestjs/common'
import { Ctx, MessagePattern, NatsContext, Payload, Transport } from '@nestjs/microservices'
import { AppService } from './app.service'
import { NatsClientService } from './modules/nats/nats-client.service'
import { NatsSubject } from './modules/nats/nats.config'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly natsClientService: NatsClientService
	) { }

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}

	@Get('health')
	getHealth(): string {
		return 'This is webhook-service'
	}

	@MessagePattern(NatsSubject.WEBHOOK_PING, Transport.NATS)
	pingServer(@Payload() payload: any, @Ctx() context: NatsContext) {
		return payload
	}

	@Get('ping-nats')
	async pingNats() {
		const response = await this.natsClientService.send(NatsSubject.WEBHOOK_PING, {
			message: 'test-nats-connect',
			data: Date.now(),
		})
		return response.data
	}

	@Post('fake-success')
	async fakeSuccess() {
		return { time: new Date().toISOString(), version: 1 }
	}

	@Post('fake-error')
	async fakeError() {
		throw new Error('Has error occurs !')
	}
}
