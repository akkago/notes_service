# Assignment - Notes Service

## 📋 Описание проекта

Создано мини-приложение для управления заметками с полным стеком технологий: backend-API на Node.js + TypeScript + Moleculer, база данных PostgreSQL с TypeORM, frontend на Vue 3 + Vite + Tailwind + TypeScript, и полная DevOps инфраструктура с Docker и Kubernetes.

## 🚀 Инструкция по запуску

### Быстрый запуск с Docker
```bash
# Клонирование репозитория
git clone <repository-url>
cd notes_service

# Запуск всех сервисов одной командой
docker-compose up -d

# Приложение будет доступно по адресу:
# Frontend: http://localhost
# Backend API: http://localhost:3000/api
```

### Локальный запуск для разработки
```bash
# 1. Установка зависимостей
npm install
cd backend && npm install
cd ../frontend && npm install

# 2. Настройка базы данных
createdb notes_db
cp backend/env.example backend/.env

# 3. Запуск приложения
npm run dev
```

### Kubernetes запуск
```bash
# Создание namespace и деплой
kubectl create namespace notes
kubectl apply -f k8s/

# Проверка статуса
kubectl get pods -n notes
```

## 🏗 Краткое описание архитектуры

### Backend (Микросервисная архитектура)
- **API Gateway** - Moleculer Web для маршрутизации запросов
- **Notes Service** - микросервис для управления заметками
- **Users Service** - микросервис для аутентификации и пользователей
- **Database Service** - сервис для инициализации базы данных
- **Message Broker** - NATS для межсервисного взаимодействия

### Frontend (SPA архитектура)
- **Vue 3** с Composition API и TypeScript
- **Pinia** для управления состоянием
- **Vue Router** для маршрутизации
- **Tailwind CSS** для стилизации
- **Axios** для HTTP запросов

### База данных
- **PostgreSQL** с TypeORM
- **Миграции** для управления схемой
- **Предзагруженные тестовые данные**

## ✅ Перечень выполненных дополнительных пунктов

### Обязательная часть
- ✅ **Node.js + TypeScript** - Backend на современном стеке
- ✅ **REST API** - Полный CRUD для заметок (GET, POST, PATCH, DELETE)
- ✅ **База данных** - PostgreSQL с предзагруженными данными
- ✅ **Frontend** - Vue 3 + Vite + Tailwind + TypeScript
- ✅ **Интерфейс** - Список, просмотр, создание, редактирование, удаление заметок
- ✅ **Простой запуск** - Одна команда для запуска всего приложения

### Дополнительные задачи (все выполнены)

#### Аутентификация
- ✅ **JWT токены** - Полная система аутентификации
- ✅ **Регистрация и вход** - Формы регистрации и авторизации
- ✅ **Защищенные маршруты** - Middleware для проверки токенов

#### Категории заметок
- ✅ **Группировка заметок** - Поле category в модели Note
- ✅ **Фильтрация по категориям** - Отображение категорий в интерфейсе

#### Полнотекстовый поиск
- ✅ **Поиск по содержимому** - API endpoint для поиска заметок
- ✅ **Поиск в интерфейсе** - Поисковая строка с живым поиском

#### Миграции
- ✅ **TypeORM миграции** - Управление схемой базы данных
- ✅ **Предзагруженные данные** - Тестовые заметки при инициализации

#### Обработка ошибок
- ✅ **Валидация данных** - На фронте и в API
- ✅ **Уведомления пользователю** - Toast уведомления об ошибках
- ✅ **Graceful error handling** - Обработка ошибок без падения приложения

#### Moleculer микросервисы
- ✅ **Разделение на сервисы** - Notes, Users, Database сервисы
- ✅ **API Gateway** - Централизованная маршрутизация
- ✅ **Message Broker** - NATS для межсервисного взаимодействия

#### Docker
- ✅ **Dockerfile для backend** - Многоэтапная сборка
- ✅ **Dockerfile для frontend** - Nginx для статических файлов
- ✅ **docker-compose** - Оркестрация всех сервисов

#### Kubernetes / k3s
- ✅ **Deployment конфигурации** - Для всех сервисов
- ✅ **Service конфигурации** - Сетевое взаимодействие
- ✅ **ConfigMap и Secret** - Управление конфигурацией
- ✅ **Ingress** - Внешний доступ к приложению
- ✅ **PersistentVolume** - Хранение данных PostgreSQL

## 🔧 Технические детали

### API Endpoints
```
GET    /api/notes           - Список заметок
GET    /api/notes/:id       - Получить заметку
POST   /api/notes           - Создать заметку
PATCH  /api/notes/:id       - Обновить заметку
DELETE /api/notes/:id       - Удалить заметку
GET    /api/notes/search    - Поиск заметок

POST   /api/users/register  - Регистрация
POST   /api/users/login     - Вход
GET    /api/users/profile   - Профиль пользователя
```

### Структура данных
```typescript
interface Note {
  id: number;
  title: string;
  content: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  createdAt: string;
}
```

### Переменные окружения
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=notes_user
DB_PASSWORD=notes_password
DB_DATABASE=notes_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Moleculer
MOLECULER_TRANSPORTER=nats://localhost:4222
MOLECULER_LOG_LEVEL=info
```

## 📊 Статистика проекта

- **Время выполнения:** ~5 часов
- **Строк кода:** ~2000+ строк
- **Файлов:** 50+ файлов
- **Технологий:** 15+ технологий
- **Дополнительных функций:** 8/8 выполнено

## 🎯 Результат

Создано полнофункциональное приложение для управления заметками, которое демонстрирует:
- Современную архитектуру микросервисов
- Полный стек разработки (backend + frontend + DevOps)
- Качественный код с TypeScript
- Готовность к продакшену с Docker и Kubernetes
- Все запрошенные дополнительные функции

Приложение готово к использованию и может быть легко развернуто в любой среде.
