# 🛒 Tienda en Línea — Proyecto Final Full-Stack

## 📋 Información General

- **Temática**: Tienda en Línea
- **Stack**: Node.js + TypeScript (API) · Django (Frontend) · MySQL · Docker
- **Equipo**: SolMaria02-ux, marbe-ux

---

## 📚 Índice

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Entidades](#entidades)
- [Cómo levantar el proyecto](#cómo-levantar-el-proyecto)
- [Documentación de la API](docs/api.md)
- [Diagrama Entidad-Relación](docs/er-diagram.png)

---

## Descripción General

Sistema de gestión de una tienda en línea con catálogo de productos organizados por categoría, carrito de compras y registro de pedidos con descuento automático de stock.

### Funcionalidades principales

- Catálogo de productos con filtro por categoría
- CRUD completo de Productos y Categorías
- Carrito de compras (por sesión)
- Creación de pedidos con validación y descuento de stock (transaccional)
- Historial de pedidos con detalle y cambio de estado
- Consultas de negocio: productos con stock bajo y ventas totales por categoría

---

## Arquitectura

```
proyectofin/
├── api/              → API REST (Node.js + TypeScript + Express + MySQL)
│   └── src/
│       ├── connection.ts
│       ├── producto.ts
│       ├── categoria.ts
│       ├── pedido.ts
│       └── routes.ts
│
├── web/              → Frontend (Django)
│   └── core/
│       ├── views.py
│       ├── urls.py
│       └── templates/
│
├── docker-compose.yml
├── init_tienda.sql   → Script de creación de tablas y datos de ejemplo
└── docs/
    ├── api.md         → Documentación de todos los endpoints
    └── er-diagram.png → Diagrama entidad-relación
```

La API (Node) maneja toda la lógica de negocio y la persistencia en MySQL. El frontend (Django) consume la API por HTTP y se encarga únicamente de la presentación.

---

## Entidades

| Entidad | Descripción |
|---|---|
| `Producto` | id, nombre, descripcion, precio, stock, categoria_id (FK) |
| `Categoria` | id, nombre, descripcion |
| `Pedido` | id, fecha, total, estado |
| `ItemPedido` | id, pedido_id (FK), producto_id (FK), cantidad, precio_unitario |

Ver el diagrama completo en [`docs/er-diagram.png`](docs/er-diagram.png).

---

## Cómo levantar el proyecto

### Requisitos
- Docker Desktop instalado y corriendo

### Pasos

1. Clona el repositorio:
   ```bash
   git clone https://github.com/SolMaria02-ux/proyectofin.git
   cd proyectofin
   ```

2. Levanta los contenedores:
   ```bash
   docker compose up --build -d
   ```

3. Carga las tablas y datos de ejemplo en MySQL:
   ```bash
   Get-Content init_tienda.sql | docker exec -i mysql_db mysql -uroot -proot app_db
   ```

4. Aplica las migraciones de Django (solo la primera vez):
   ```bash
   docker exec -it django_web python manage.py migrate
   ```

5. Verifica que los 3 contenedores estén corriendo:
   ```bash
   docker compose ps
   ```

### Acceso

| Servicio | URL |
|---|---|
| Frontend (Django) | http://localhost:8000 |
| API (Node) | http://localhost:3000/api |
| MySQL | localhost:3306 |

---

## Documentación adicional

- 📄 [Documentación completa de la API](docs/api.md)
- 🗺️ [Diagrama entidad-relación](docs/er-diagram.png)
