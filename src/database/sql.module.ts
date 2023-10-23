import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SqlConfig } from './sql.config'

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule.forFeature(SqlConfig)],
			inject: [SqlConfig.KEY],
			useFactory: (sqlConfig: ConfigType<typeof SqlConfig>) => sqlConfig,
		}),
		TypeOrmModule.forFeature([
			// EventEntity,
			// HookEntity,
			// EventHistoryEntity,
		]),
	],
	// providers: [EventRepository, HookRepository, EventHistoryRepository],
	// exports: [EventRepository, HookRepository, EventHistoryRepository],
})
export class SqlModule { }
