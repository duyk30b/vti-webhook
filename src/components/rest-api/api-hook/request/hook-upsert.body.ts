import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsDefined, IsEnum, IsMongoId, IsObject, IsUrl } from 'class-validator'
import { Types } from 'mongoose'
import { valuesEnum } from 'src/common/helpers/typescript.helper'
import { ProtocolType } from 'src/database/common/enum'

export class HookCreateBody {
	@ApiProperty({ example: '6532515ed68320d3e998f4ed' })
	@Expose()
	// @Transform(({ value }) => {
	// 	try { return new Types.ObjectId(value) }
	// 	catch (e: any) { return undefined }
	// })
	@IsDefined()
	@IsMongoId()
	eventId: string

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
