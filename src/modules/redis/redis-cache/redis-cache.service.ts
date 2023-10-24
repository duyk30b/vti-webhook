import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'

@Injectable()
export class RedisCacheService {
	private logger = new Logger(RedisCacheService.name)
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

	async set(key: string, value: unknown, ttl?: number): Promise<void> {
		await this.cacheManager.set(`webhook::${key}`, value, ttl)
	}

	async get(key: string, jsonParse: boolean) {
		const data = await this.cacheManager.get<string>(`webhook::${key}`)
		if (key && jsonParse) return JSON.parse(data)
		return data
	}

	async del(key: string) {
		return await this.cacheManager.del(`webhook::${key}`)
	}
}