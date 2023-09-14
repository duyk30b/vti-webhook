import { Expose } from 'class-transformer'
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { ProtocolType } from '../common/enum'

@Entity({ name: 'event_history' })
@Index('idx_event_history__code', ['code'])
export class EventHistoryEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    @Expose()
    id: number

    @Column({ name: 'code', type: 'varchar' })
    @Expose()
    code: string

    @Column({ name: 'name', type: 'varchar' })
    @Expose()
    name: string

    @Column({ name: 'protocol_type', type: 'varchar', nullable: true })
    @Expose()
    protocolType: ProtocolType

    @Column({ name: 'request', type: 'simple-json', default: {} })
    @Expose()
    request: Record<string, any>

    @Column({ name: 'response', type: 'simple-json', default: {} })
    @Expose()
    response: Record<string, any>

    @Column({ name: 'success', type: 'boolean' })
    @Expose()
    success: boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    @Expose()
    createdAt: Date
}
