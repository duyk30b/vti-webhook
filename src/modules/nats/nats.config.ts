import { registerAs } from '@nestjs/config'
import 'dotenv/config'

export const NatsConfig = registerAs('nats', () => {
	return { servers: process.env.NATS_SERVERS?.split(',') || ['nats://nats:4222'] }
})
export const NATS_SERVERS = process.env.NATS_SERVERS?.split(',') || ['nats://nats:4222']

export const NatsService = {
	AUTH: process.env.NATS_AUTH_SERVICE || 'auth_service',
	USER: process.env.NATS_USER_SERVICE || 'user_service',
	WEBHOOK: process.env.NATS_WEBHOOK_SERVICE || 'webhook_service',
}

export const NatsSubject = {
	WEBHOOK_REGISTER_EVENT: NatsService.WEBHOOK + '.register_event',
	WEBHOOK_PING: NatsService.WEBHOOK + '.ping',
	AUTH_PING: NatsService.AUTH + '.ping',
	AUTH_VALIDATE_TOKEN: NatsService.AUTH + '.validate_token',
}

export const NATS_REQUEST = process.env.NATS_REQUEST_SERVICE || 'request_service'
export const NATS_WAREHOUSE = process.env.NATS_WAREHOUSE_SERVICE || 'warehouse_service'
export const NATS_PRODUCE = process.env.NATS_PRODUCE_SERVICE || 'produce_service'
export const NATS_ATTRIBUTE = process.env.NATS_ATTRIBUTE_SERVICE || 'attribute_service'
export const NATS_SALE = process.env.NATS_SALE_SERVICE || 'sale_service'
export const NATS_ITEM = process.env.NATS_ITEM_SERVICE || 'item_service'
export const NATS_MMS = process.env.NATS_MMS_SERVICE || 'mms_service'
export const NATS_NOTIFICATION = process.env.NATS_NOTIFICATION_SERVICE || 'notification_service'
export const NATS_PLAN = process.env.NATS_PLAN_SERVICE || 'plan_service'
export const NATS_PURCHASED_ORDER = process.env.NATS_PURCHASED_ORDER_SERVICE || 'purchased_order_service'
export const NATS_REPORT = process.env.NATS_REPORT_SERVICE || 'report_service'
export const NATS_TICKET = process.env.NATS_TICKET_SERVICE || 'ticket_service'
export const NATS_WAREHOUSE_LAYOUT = process.env.NATS_WAREHOUSE_LAYOUT_SERVICE || 'warehouse_layout_service'
