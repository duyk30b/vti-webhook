export interface HookCondition {
	id?: string
	eventId?: string

	ids?: string[]
	eventIds?: string[]
}

export type HookOrder = {
	[P in 'id' | 'code']?: 'ASC' | 'DESC'
}