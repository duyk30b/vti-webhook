build:
	docker build --no-cache -t "webhook-service-image" .

up:
	docker compose -f docker-compose.local.yml up -d
	docker compose -f docker-compose.local.yml logs -f

logs:
	docker compose -f docker-compose.local.yml logs -f

down:
	docker compose -f docker-compose.local.yml down

up-clean:
	docker compose -f docker-compose.local.yml down
	docker system prune -a -f
	docker compose -f docker-compose.local.yml up -d
	docker compose -f docker-compose.local.yml logs -f