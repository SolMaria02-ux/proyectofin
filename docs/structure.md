proyecto/
│
├── api/      # Node.js + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
|   │   |   ├── connection.ts
│   │   ├── helpers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── catalogo.ts
│   │   └── app.ts
|   ├── ecosystem.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│   └── .env
│
├── web/      # Django
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── views/
│   │   └── app.ts
|   ├── core/
|   │   ├── templates/
|   |   |   ├── index.html
|   │   ├── urls.py
|   │   ├── views.py
│   ├── package.json
│   └── Dockerfile
│   └── .env
│
└── docker-compose.yml
