import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'
import { IsDefined, IsEnum, IsObject, IsPositive, IsUrl } from 'class-validator'
import { valuesEnum } from 'src/common/helpers/typescript.helper'
import { ProtocolType } from 'src/database/common/enum'

export class HookCreateBody {
	@ApiProperty({ example: 2 })
	@Expose()
	@IsDefined()
	@IsPositive()
	eventId: number

	@ApiProperty({ enum: valuesEnum(ProtocolType), example: ProtocolType.RestAPI })
	@Expose()
	@IsDefined()
	@IsEnum(ProtocolType)
	protocolType: ProtocolType

	@ApiProperty({ example: 'https://git.vti.com.vn/' })
	@Expose()
	@IsDefined()
	@IsUrl()
	url: string

	@ApiPropertyOptional({ type: 'string', example: { token: 'Abc@123' } })
	@Expose()
	@IsObject()
	header: Record<string, any>
}

export class HookUpdateBody extends PartialType(HookCreateBody) { }
