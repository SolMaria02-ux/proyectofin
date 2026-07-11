# 🛒 Tienda en Línea — Proyecto Final Full-Stack

Sistema web de gestión de una tienda en línea, desarrollado como Proyecto Final del curso, siguiendo Clean Architecture y orquestado con Docker Compose.

## 📋 Descripción General

Sistema que permite gestionar un catálogo de productos, categorías y pedidos, con un backend API en **Node.js + TypeScript** y un frontend en **Django**, ambos conectados a una base de datos **MySQL** con relaciones entre entidades.

## 🧱 Tecnologías Utilizadas

| Capa | Tecnología |
|---|---|
| API / Backend | Node.js + TypeScript + Express |
| Frontend | Django (Python) |
| Base de datos | MySQL 8 |
| Orquestación | Docker + Docker Compose |

## 🗂️ Entidades del Dominio

- **Producto** (id, nombre, descripción, precio, stock, categoría_id)
- **Categoría** (id, nombre, descripción)
- **Pedido** (id, fecha, total, estado, items)
- **ItemPedido** (id, pedido_id, producto_id, cantidad, precio_unitario)

Relación: Producto → Categoría (FK) | ItemPedido → Producto y Pedido (FK)

## ✅ Funcionalidades Implementadas

### CRUD completo
- **Categoría**: crear, listar, editar, eliminar
- **Producto**: crear, listar, editar, eliminar (con selección de categoría)

### Catálogo y Carrito
- Catálogo de productos con filtro por categoría
- Carrito de compras (agregar, quitar productos)
- Confirmación de pedido (descuenta stock automáticamente)

### Pedidos
- Historial de pedidos con estado visual (pendiente / completado / cancelado)
- Detalle de pedido: productos, cantidades, precio unitario y subtotal
- Cambio de estado del pedido desde el historial

### Consultas de Negocio
- **Alerta de inventario bajo**: productos con stock menor a un límite configurable
- **Total de ventas por categoría**: suma de ventas agrupada por categoría

## 🔌 Endpoints de la API

| Método | URL | Descripción |
|---|---|---|
| GET | `/api/productos` | Listar productos con stock > 0 |
| GET | `/api/productos/:id` | Detalle de un producto |
| POST | `/api/productos` | Crear producto |
| PUT | `/api/productos/:id` | Actualizar producto |
| DELETE | `/api/productos/:id` | Eliminar producto |
| GET | `/api/productos/bajo-stock` | Productos con stock bajo |
| GET | `/api/categorias` | Listar categorías |
| GET | `/api/categorias/:id` | Detalle de categoría |
| POST | `/api/categorias` | Crear categoría |
| PUT | `/api/categorias/:id` | Actualizar categoría |
| DELETE | `/api/categorias/:id` | Eliminar categoría |
| GET | `/api/categorias/ventas` | Total de ventas por categoría |
| POST | `/api/pedidos` | Crear pedido (descuenta stock) |
| GET | `/api/pedidos` | Listar pedidos |
| GET | `/api/pedidos/:id` | Detalle del pedido con items |
| PUT | `/api/pedidos/:id` | Actualizar estado del pedido |

## 🖥️ Vistas Django (Frontend)

| Ruta | Descripción |
|---|---|
| `/` | Catálogo con filtro por categoría |
| `/carrito/` | Ver carrito de compras |
| `/carrito/agregar/<id>/` | Agregar producto al carrito |
| `/carrito/confirmar/` | Confirmar pedido |
| `/pedidos/` | Historial de pedidos |
| `/pedidos/<id>/` | Detalle de un pedido |
| `/pedidos/<id>/estado/` | Cambiar estado de un pedido |
| `/categorias/` | Listar categorías |
| `/categorias/nueva/` | Crear categoría |
| `/categorias/<id>/editar/` | Editar categoría |
| `/categorias/<id>/eliminar/` | Eliminar categoría |
| `/productos/admin/` | Administrar productos (listado) |
| `/productos/nuevo/` | Crear producto |
| `/productos/<id>/editar/` | Editar producto |
| `/productos/<id>/eliminar/` | Eliminar producto |
| `/reportes/stock-bajo/` | Alerta de inventario bajo |
| `/reportes/ventas-categoria/` | Ventas totales por categoría |

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- Docker Desktop instalado y corriendo

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/SolMaria02-ux/proyectofin.git
cd proyectofin
```

2. Levantar los contenedores:
```bash
docker compose up -d --build
```

3. Ejecutar las migraciones de Django (solo la primera vez):
```bash
docker compose exec web python manage.py migrate
```

4. Acceder a la aplicación:
```
http://localhost:8000/
```

### Verificar que los contenedores estén corriendo
```bash
docker compose ps
```

Deberían aparecer 3 servicios activos: `db` (MySQL), `api` (Node/TypeScript) y `web` (Django).

## 🗄️ Estructura del Proyecto

```
proyectofin/
├── docker-compose.yml
├── api/                     # Backend Node.js + TypeScript
│   └── src/
│       ├── routes.ts
│       ├── producto.ts
│       ├── categoria.ts
│       └── pedido.ts
└── web/                     # Frontend Django
    └── core/
        ├── views.py
        ├── urls.py
        └── templates/
```

## 👥 Equipo y Colaboración

Proyecto desarrollado en equipo, con control de versiones mediante ramas por funcionalidad y Pull Requests en GitHub:

- `feature/consultas-negocio` → CRUD de Producto y consultas de negocio
- `feature/pedido-completo` → Detalle de pedido y cambio de estado

Cada funcionalidad fue desarrollada en su propia rama, integrada a `master` mediante Pull Request tras revisión del equipo.

## 📊 Diagrama Entidad-Relación

*(Ver archivo de diagrama ER adjunto en la documentación del proyecto)*

## 📌 Notas Técnicas

- La persistencia se realiza en MySQL con claves foráneas entre `producto` → `categoria`, e `item_pedido` → `producto`/`pedido`.
- El carrito de compras se maneja mediante sesiones de Django (`request.session`).
- Al confirmar un pedido, el stock de cada producto se descuenta automáticamente a través de la API.
