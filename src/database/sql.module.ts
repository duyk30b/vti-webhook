import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SqlConfig } from './sql.config'
import { EventEntity } from './entities/event.entity'
import { HookEntity } from './entities/hook.entity'
import { EventHistoryEntity } from './entities/event-history.entity'
import { EventRepository } from './repository/event/event.repository'
import { HookRepository } from './repository/hook/hook.repository'
import { EventHistoryRepository } from './repository/event-history/event-history.repository'

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule.forFeature(SqlConfig)],
			inject: [SqlConfig.KEY],
			useFactory: (sqlConfig: ConfigType<typeof SqlConfig>) => sqlConfig,
		}),
		TypeOrmModule.forFeature([
			EventEntity,
			HookEntity,
			EventHistoryEntity,
		]),
	],
	providers: [EventRepository, HookRepository, EventHistoryRepository],
	exports: [EventRepository, HookRepository, EventHistoryRepository],
})
export class SqlModule { }
