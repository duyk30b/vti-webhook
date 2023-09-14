import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { HeaderReq } from 'src/core/decorator/request.decorator'
import { NatsSubject } from 'src/modules/nats/nats.config'
import { NatsServerService } from './nats-server.service'
import { EventRegisterBody } from './request'

@Controller()
export class NatsServerController {
	constructor(private readonly natsServerService: NatsServerService) {
	}

	@MessagePattern(NatsSubject.WEBHOOK_REGISTER_EVENT, Transport.NATS)
	async registerEvent(@Payload() data: EventRegisterBody, @HeaderReq() headerReq: any) {
		return this.natsServerService.registerEvent(data)
	}
}
