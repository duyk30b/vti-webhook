export interface NatsResponseInterface {
	statusCode: number
	message: string
	data: Record<string, any>
}