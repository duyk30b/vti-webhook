import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const SqlConfig = registerAs('sql_config', (): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: process.env.DATABASE_POSTGRES_HOST,
	port: parseInt(process.env.DATABASE_POSTGRES_PORT),
	database: process.env.DATABASE_NAME,
	username: process.env.DATABASE_POSTGRES_USERNAME,
	password: process.env.DATABASE_POSTGRES_PASSWORD,
	autoLoadEntities: true,
	synchronize: false,
	extra: { max: parseInt(process.env.POSTGRES_MAX_POOL) || 20 },
	logging: ['production', 'staging'].includes(process.env.NODE_ENV) ? ['error'] : 'all',
}))
