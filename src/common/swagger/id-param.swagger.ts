import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator'

export class IdParam {
	@ApiProperty({ name: 'id', example: 2 })
	@Expose({ name: 'id' })
	@IsNotEmpty()
	@Type(() => Number)
	@IsNumber()
	id: number
}

export class IdMongoParam {
	@ApiProperty({ name: 'id', example: '6535d4debd26f340cf56e200' })
	@Expose({ name: 'id' })
	@IsNotEmpty()
	@IsMongoId()
	id: string
}
