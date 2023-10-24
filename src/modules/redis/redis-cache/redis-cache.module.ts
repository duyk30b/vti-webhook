import { CacheModule, CacheStore } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-store'
import type { RedisClientOptions } from 'redis'
import { RedisConfig } from '../redis.config'
import { RedisCacheService } from './redis-cache.service'

@Global()
@Module({
	imports: [
		CacheModule.registerAsync<RedisClientOptions>({
			imports: [ConfigModule.forFeature(RedisConfig)],
			inject: [RedisConfig.KEY],
			useFactory: async (redisConfig: ConfigType<typeof RedisConfig>) => {
				const store = await redisStore({
					commandsQueueMaxLength: 10_000,
					socket: {
						host: redisConfig.host,
						port: redisConfig.port,
					},
				})
				return {
					isGlobal: true,
					max: 10_000,
					store: store as unknown as CacheStore,
					ttl: 1000 * 60 * 60 * 24 * 7, // 1 week
				}
			},
		}),
	],
	providers: [RedisCacheService],
	exports: [RedisCacheService],
})
export class RedisCacheModule { }
