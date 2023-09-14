export class EventHistoryCondition {
    id?: number
    code?: number
    success?: boolean

    ids?: number[]
    codes?: number[]
}

export type EventHistoryOrder = {
    [P in 'id']?: 'ASC' | 'DESC'
}
