# GlowOS — Skincare Intelligence Platform

Event-driven microservices architecture with a stunning 3D frontend.

## Architecture

```
POST /api/products/drops
        │
        ▼
ProductDropService ──► [ProductDropped] ──► NotificationService ──► SignalR → Browser
        (publishes)         RabbitMQ          (matches users,          (real-time alert)
                                               stores alerts)

POST /api/routines  ──► [ReviewDueEvent] ──► ReviewService ──► [ReviewDueEvent after 30d]
        │                  (scheduled)         (stores it,         ──► NotificationService
        ▼                                       fires on time)
  RoutineService
  (saves routine,
   checks conflicts)
```

## Services

| Service | Port | Role |
|---|---|---|
| **Frontend** | 3000 | React + Three.js + Framer Motion |
| **RoutineService** | 5001 | REST API — manage AM/PM routines |
| **ProductDropService** | 5002 | REST API — post drops, publish events |
| **NotificationService** | 5003 | Event consumer + SignalR hub |
| **ReviewService** | worker | Scheduled background job |
| **RabbitMQ** | 15672 | Message broker (management UI) |

## Run with Docker

```bash
cd skincare-app
docker compose up --build
```

Then open: http://localhost:3000

RabbitMQ management UI: http://localhost:15672 (guest/guest)

## Run locally (dev)

```bash
# Terminal 1 — RabbitMQ
docker run -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev

# Terminal 3 — RoutineService
cd services/RoutineService && dotnet run

# Terminal 4 — ProductDropService
cd services/ProductDropService && dotnet run

# Terminal 5 — NotificationService
cd services/NotificationService && dotnet run

# Terminal 6 — ReviewService
cd services/ReviewService && dotnet run
```

## Try it

1. Open http://localhost:3000
2. Go to **My Routine** → add a few products
3. Go to **Product Drops** → wishlist a drop (triggers alert)
4. Click the 🔔 bell — see real-time notifications

## Event Flow Demo

```bash
# Post a new drop — this fans out to all matched users
curl -X POST http://localhost:5002/api/products/drops \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Glow Serum X",
    "brand": "The Lab",
    "category": "Serum",
    "price": 45.00,
    "originalPrice": 60.00,
    "targetSkinTypes": ["oily", "acne"],
    "targetConcerns": ["hyperpigmentation"],
    "stockCount": 50,
    "durationHours": 24
  }'
```

Watch the NotificationService logs — it receives the event, creates an alert, and pushes via SignalR.
