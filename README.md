## Running the app

```bash
# Local
$ make up

# production mode
$ npm run start:prod
```

## Migrations

```bash
# Create a migration
$ npm run migration:create --name=foo

# Generate a migration from schema changes
$ npm run migration:generate --name=bar

# Run migrations and checks for schema changes
$ npm run migration:run

# Revert migrations
$ npm run migration:revert
```

## Instruction

- Đăng ký event và gửi event từ các service khác. Demo tại project ticket-service

1. Đăng ký Event khi khởi chạỵ server

- Tại app.service.ts, đăng ký những event cần dùng

```
  async onModuleInit() {
    await this.registerEventWebhook();
  }
 	async registerEventWebhook() {
    const events = [
      {
        code: WebhookCode.TICKET_EXPORT_CREATE,
        name: 'Event tạo phiếu xuất kho',
				description: ''
      },
      {
        code: WebhookCode.TICKET_EXPORT_UPDATE,
        name: 'Event cập nhật phiếu xuất kho',
				description: ''
      },
    ];
    const response = await this.natsClientService.send(
      NatsSubject.WEBHOOK_REGISTER_EVENT,
      {
        data: events,
      },
    );
    return response.data;
  }
```

2. Bắn event kafka khi có sự kiện, giả sử khi cập nhật phiếu xuất kho

```
	await this.kafkaClientService.sendTopicWebhookProcessEvent({
		code: WebhookCode.TICKET_EXPORT_UPDATE,
		data: ticket,
	});
```
