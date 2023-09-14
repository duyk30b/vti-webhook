export class EventCondition {
    id?: number
    code?: string

    ids?: number[]
    codes?: string[]
}

export type EventOrder = {
    [P in 'id' | 'code']?: 'ASC' | 'DESC'
}
