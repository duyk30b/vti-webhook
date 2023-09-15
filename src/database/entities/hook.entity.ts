import { Expose } from 'class-transformer'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ProtocolType } from '../common/enum'
import { EventEntity } from './event.entity'

@Entity({ name: 'hook' })
export class HookEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    @Expose()
    id: number

    @Column({ name: 'event_id' })
    @Expose()
    eventId: number

    @ManyToOne((type) => EventEntity, { createForeignKeyConstraints: false })
    @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
    @Expose()
    event: EventEntity

    @Column({ name: 'protocol_type', type: 'varchar', default: ProtocolType.RestAPI })
    @Expose()
    protocolType: ProtocolType

    @Column({ name: 'url', type: 'varchar' })
    @Expose()
    url: string

    @Column({ name: 'header', type: 'simple-json', default: {} })
    @Expose()
    header: Record<string, any>

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    @Expose()
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    @Expose()
    updatedAt: Date
}
