# Notes Service

Мини-приложение для управления заметками с backend-API, базой данных и frontend-интерфейсом.

## 🚀 Технологический стек

### Backend
- **Node.js** + **TypeScript**
- **Moleculer** - микросервисная архитектура
- **TypeORM** - ORM для работы с базой данных
- **PostgreSQL** - основная база данных
- **NATS** - message broker для микросервисов
- **JWT** - аутентификация

### Frontend
- **Vue 3** + **TypeScript**
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **Pinia** - управление состоянием
- **Vue Router** - маршрутизация

### DevOps
- **Docker** + **Docker Compose**
- **Kubernetes** / **k3s** - оркестрация
- **Nginx** - reverse proxy

## 📋 Функциональность

### Обязательная часть ✅
- ✅ REST API для CRUD операций с заметками
- ✅ Frontend интерфейс для управления заметками
- ✅ База данных PostgreSQL с предзагруженными данными
- ✅ Простой запуск проекта

### Дополнительные функции ✅
- ✅ **Аутентификация** - JWT + учёт пользователей
- ✅ **Категории заметок** - группировка заметок
- ✅ **Полнотекстовый поиск** - поиск по содержимому
- ✅ **Миграции** - использование миграций в ORM
- ✅ **Обработка ошибок** - валидация и уведомления
- ✅ **Moleculer** - разделение на микросервисы
- ✅ **Docker** - контейнеризация
- ✅ **docker-compose** - оркестрация сервисов
- ✅ **Kubernetes** - конфигурации для деплоя

## 🛠 Установка и запуск

### Предварительные требования
- Node.js 18+
- PostgreSQL 15+
- Docker и Docker Compose (опционально)

### Локальный запуск

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd notes_service
```

2. **Установка зависимостей**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

3. **Настройка базы данных**
```bash
# Создайте базу данных PostgreSQL
createdb notes_db

# Скопируйте файл окружения
cp backend/env.example backend/.env

# Отредактируйте переменные в backend/.env
```

4. **Запуск приложения**
```bash
# Запуск backend и frontend одновременно
npm run dev

# Или по отдельности:
npm run dev:backend  # порт 3000
npm run dev:frontend # порт 5173
```

### Docker запуск

1. **Запуск всех сервисов**
```bash
docker-compose up -d
```

2. **Проверка статуса**
```bash
docker-compose ps
```

3. **Остановка**
```bash
docker-compose down
```

### Kubernetes запуск

1. **Создание namespace**
```bash
kubectl create namespace notes
```

2. **Применение конфигураций**
```bash
kubectl apply -f k8s/configmap-secret.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/nats.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

3. **Проверка статуса**
```bash
kubectl get pods -n notes
kubectl get services -n notes
```

## 📚 API Документация

### Заметки

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/notes` | Получить список заметок |
| GET | `/api/notes/:id` | Получить заметку по ID |
| POST | `/api/notes` | Создать новую заметку |
| PATCH | `/api/notes/:id` | Обновить заметку |
| DELETE | `/api/notes/:id` | Удалить заметку |
| GET | `/api/notes/search?query=...` | Поиск заметок |

### Пользователи

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/users/register` | Регистрация |
| POST | `/api/users/login` | Вход |
| GET | `/api/users/profile` | Профиль пользователя |

### Структура заметки
```json
{
  "id": 1,
  "title": "Заголовок заметки",
  "content": "Содержимое заметки",
  "category": "Категория",
  "createdAt": "2023-12-01T10:00:00.000Z",
  "updatedAt": "2023-12-01T10:00:00.000Z"
}
```

## 🏗 Архитектура

### Backend архитектура
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Notes Service  │    │  Users Service  │
│  (Moleculer)    │◄──►│   (Moleculer)   │    │   (Moleculer)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

### Frontend архитектура
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vue Router    │    │   Pinia Store   │    │   API Client    │
│   (Pages)       │◄──►│   (State)       │◄──►│   (Axios)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Переменные окружения

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=notes_user
DB_PASSWORD=notes_password
DB_DATABASE=notes_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
MOLECULER_TRANSPORTER=nats://localhost:4222
MOLECULER_LOG_LEVEL=info
```

## 🧪 Тестирование

### Запуск тестов
```bash
# Backend тесты
cd backend && npm test

# Frontend тесты
cd frontend && npm test
```

## 📦 Сборка для продакшена

```bash
# Сборка всех компонентов
npm run build

# Сборка только backend
npm run build:backend

# Сборка только frontend
npm run build:frontend
```
