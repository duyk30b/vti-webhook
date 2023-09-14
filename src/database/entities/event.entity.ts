import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'event' })
export class EventEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    @Expose()
    id: number

    @Column({ name: 'code', type: 'varchar', unique: true })
    @Expose()
    code: string

    @Column({ name: 'name', type: 'varchar' })
    @Expose()
    name: string

    @Column({ name: 'description', type: 'text', nullable: true })
    @Expose()
    description: string
}
