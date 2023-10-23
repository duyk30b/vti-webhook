export interface EventCondition {
	id?: string
	code?: string

	ids?: string[]
	codes?: string[]
}

export type EventOrder = {
	[P in 'id' | 'code']?: 'ASC' | 'DESC'
}