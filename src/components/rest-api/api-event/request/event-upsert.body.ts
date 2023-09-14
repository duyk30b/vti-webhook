import { ApiProperty, PartialType } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsDefined, IsNotEmpty, IsString } from 'class-validator'

export class EventCreateBody {
  @ApiProperty({ example: 'TICKET_IMPORT_CREATE' })
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  code: string

  @ApiProperty({ example: 'Event tạo phiếu nhập hàng' })
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: '' })
  @Expose()
  @IsString()
  description: string
}

export class EventUpdateBody extends PartialType(EventCreateBody) { }
