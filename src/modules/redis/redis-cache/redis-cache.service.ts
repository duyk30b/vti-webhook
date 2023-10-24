import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class RedisCacheService {
	private logger = new Logger(RedisCacheService.name)
	private readonly prefix = 'webhook'

	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

	/**
		* @param ttlSeconds if "undefined" then TTL = default global, if "0" then TTL = No expiry
	*/
	async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
		// await this.cacheManager.set(`${this.prefix}::${key}`, value, ttlSeconds) // không dùng được vì lỗi version cache, đợi nestjs fix
		await this.cacheManager.set(`${this.prefix}::${key}`, value, { ttl: ttlSeconds } as any)
	}

	async get(key: string, jsonParse?: boolean) {
		const data = await this.cacheManager.get<string>(`${this.prefix}::${key}`)
		if (key && jsonParse) return JSON.parse(data)
		return data
	}

	async del(key: string) {
		return await this.cacheManager.del(`webhook::${key}`)
	}
}