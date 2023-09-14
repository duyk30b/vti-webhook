import { Expose, Type } from 'class-transformer'
import { IsArray, IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class EventBody {
	@IsDefined()
	@IsNotEmpty()
	code: string

	@IsDefined()
	@IsNotEmpty()
	name: string

	@Expose()
	@IsString()
	description: string
}

export class EventRegisterBody {
	@Type(() => EventBody)
	@IsDefined()
	@IsArray()
	@ValidateNested({ each: true })
	data: EventBody[]
}
