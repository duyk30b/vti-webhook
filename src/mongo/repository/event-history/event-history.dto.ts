export interface EventHistoryCondition {
	id?: string
	code?: string

	ids?: string[]
	codes?: string[]
}

export type EventHistoryOrder = {
	[P in 'id' | 'code']?: 'ASC' | 'DESC'
}