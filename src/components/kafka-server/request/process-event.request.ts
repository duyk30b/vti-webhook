import { Expose } from 'class-transformer'
import { IsDefined, IsNotEmpty, IsObject, IsString } from 'class-validator'
import { KafkaBaseRequest } from 'src/modules/kafka/kafka-base.request'

export class ProcessEventRequest extends KafkaBaseRequest {
	@IsDefined()
	@IsNotEmpty()
	code: string

	@IsDefined()
	@IsObject()
	data: Record<string, any>
}
