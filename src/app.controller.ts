import { Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}

	@Get('health')
	getHealth(): string {
		return 'This is webhook-service'
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
