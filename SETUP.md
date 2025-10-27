# Настройка окружения

## Backend

1. Скопируйте файл `backend/env.example` в `backend/.env`
2. Отредактируйте переменные в `backend/.env` под вашу среду

## Frontend

Frontend не требует дополнительной настройки окружения - все настройки уже включены в код.

## База данных

1. Убедитесь, что PostgreSQL запущен
2. Создайте базу данных:
```sql
CREATE DATABASE notes_db;
CREATE USER notes_user WITH PASSWORD 'notes_password';
GRANT ALL PRIVILEGES ON DATABASE notes_db TO notes_user;
```

## NATS (опционально)

Для полной функциональности микросервисов установите NATS:
```bash
# С помощью Docker
docker run -p 4222:4222 nats:2.9-alpine --jetstream

# Или установите локально
# См. https://docs.nats.io/running-a-nats-service/introduction/installation
```
