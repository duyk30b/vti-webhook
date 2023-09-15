import { Inject, Injectable } from '@nestjs/common'
import { ClientNats } from '@nestjs/microservices'
import { NatsClientService } from './nats-client.service'
import { NatsSubject } from './nats.config'
import { NatsResponseInterface } from './nats.interface'

@Injectable()
export class AuthNatsService {
	constructor(
		@Inject('NATS_CLIENT_SERVICE') private readonly natsClient: ClientNats,
		private readonly natsClientService: NatsClientService
	) { }

	async validateToken(token: string, permissionCode: string): Promise<NatsResponseInterface> {
		const response = await this.natsClientService.send(
			NatsSubject.AUTH_VALIDATE_TOKEN,
			{ permissionCode, token }
		)
		return response
	}
}
