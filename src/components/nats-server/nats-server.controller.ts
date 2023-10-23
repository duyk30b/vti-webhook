import { Controller, Get } from '@nestjs/common'
import { Ctx, MessagePattern, NatsContext, Payload, Transport } from '@nestjs/microservices'
import { HeaderReq } from 'src/core/decorator/request.decorator'
import { NatsSubject } from 'src/modules/nats/nats.config'
import { NatsServerService } from './nats-server.service'
import { EventRegisterBody } from './request'
import { NatsClientService } from 'src/modules/nats/nats-client.service'

@Controller()
export class NatsServerController {
	constructor(
		private readonly natsClientService: NatsClientService,
		private readonly natsServerService: NatsServerService
	) {
	}

	@Get('nats/ping-webhook')
	async pingWebhook() {
		const response = await this.natsClientService.send(NatsSubject.WEBHOOK.PING, {
			client: 'webhook-service',
			server: 'webhook-service',
			message: 'ping',
			time: Date.now(),
		})
		return response
	}

	@Get('nats/ping-report')
	async pingReport() {
		const response = await this.natsClientService.send(NatsSubject.REPORT.PING, {
			client: 'webhook-service',
			server: 'report-service',
			message: 'ping',
			time: Date.now(),
		})
		return response
	}

	@Get('nats/ping-ticket')
	async pingTicket() {
		const response = await this.natsClientService.send(NatsSubject.TICKET.PING, {
			client: 'webhook-service',
			server: 'ticket-service',
			message: 'ping',
			time: Date.now(),
		})
		return response
	}

	@Get('nats/ping-warehouse')
	async pingWarehouse() {
		const response = await this.natsClientService.send(NatsSubject.WAREHOUSE.PING, {
			client: 'webhook-service',
			server: 'warehouse-service',
			message: 'ping',
			time: Date.now(),
		})
		return response
	}

	@MessagePattern(NatsSubject.WEBHOOK.PING, Transport.NATS)
	pong(@Payload() payload: any, @Ctx() context: NatsContext) {
		return this.natsServerService.pong(payload)
	}

	@MessagePattern(NatsSubject.WEBHOOK.REGISTER_EVENT, Transport.NATS)
	async registerEvent(@Payload() data: EventRegisterBody, @HeaderReq() headerReq: any) {
		return this.natsServerService.registerEvent(data)
	}
}
