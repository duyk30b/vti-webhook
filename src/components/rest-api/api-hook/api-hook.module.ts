import { Module } from '@nestjs/common'
import { ApiHookController } from './api-hook.controller'
import { ApiHookService } from './api-hook.service'

@Module({
	imports: [],
	controllers: [ApiHookController],
	providers: [ApiHookService],
})
export class ApiHookModule { }
