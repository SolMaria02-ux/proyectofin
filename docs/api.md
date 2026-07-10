# Documentación de la API — Tienda en Línea

Base URL: `http://localhost:3000/api`

Todas las respuestas son en formato JSON.

---

## Productos

### Listar productos disponibles
```
GET /api/productos
```
Devuelve todos los productos con `stock > 0`.

**Respuesta ejemplo:**
```json
[
  {
    "id": 1,
    "nombre": "Audífonos Bluetooth",
    "descripcion": "Audífonos inalámbricos con cancelación de ruido",
    "precio": "45.99",
    "stock": 15,
    "categoria_id": 1
  }
]
```

### Obtener un producto por id
```
GET /api/productos/:id
```
**Respuesta 200:** el objeto del producto.
**Respuesta 404:** `{ "error": "Producto no encontrado" }`

### Crear un producto
```
POST /api/productos
```
**Body:**
```json
{
  "nombre": "Mouse inalámbrico",
  "descripcion": "Mouse ergonómico 2.4GHz",
  "precio": 18.50,
  "stock": 30,
  "categoria_id": 1
}
```
**Respuesta 201:** el producto creado, con su `id` asignado.

### Actualizar un producto (precio/stock/etc.)
```
PUT /api/productos/:id
```
**Body:** cualquier combinación de los campos a actualizar (nombre, descripcion, precio, stock, categoria_id).
**Respuesta 200:** el producto actualizado.

### Eliminar un producto
```
DELETE /api/productos/:id
```
**Respuesta 200:** `{ "mensaje": "Producto eliminado", "id": 4 }`

### Consulta de negocio — productos con stock bajo
```
GET /api/productos/bajo-stock?limite=5
```
Devuelve los productos con `stock < limite` (por defecto, `limite = 5` si no se especifica).

---

## Categorías

### Listar categorías
```
GET /api/categorias
```
**Respuesta ejemplo:**
```json
[
  { "id": 1, "nombre": "Electrónica", "descripcion": "Dispositivos y accesorios electrónicos" }
]
```

### Obtener una categoría por id
```
GET /api/categorias/:id
```

### Crear una categoría
```
POST /api/categorias
```
**Body:**
```json
{ "nombre": "Deportes", "descripcion": "Artículos deportivos" }
```

### Actualizar una categoría
```
PUT /api/categorias/:id
```
**Body:** `{ "nombre": "...", "descripcion": "..." }`

### Eliminar una categoría
```
DELETE /api/categorias/:id
```

### Consulta de negocio — ventas totales por categoría
```
GET /api/categorias/ventas
```
Devuelve el total vendido (suma de `cantidad * precio_unitario` de todos los pedidos) agrupado por categoría.

**Respuesta ejemplo:**
```json
[
  { "categoria_id": 1, "categoria": "Electrónica", "total_vendido": "91.98" },
  { "categoria_id": 2, "categoria": "Ropa", "total_vendido": "0.00" }
]
```

---

## Pedidos

### Crear un pedido
```
POST /api/pedidos
```
Crea el pedido, calcula el total automáticamente y **descuenta el stock** de cada producto (operación todo-o-nada: si un producto no tiene stock suficiente, no se crea nada).

**Body:**
```json
{
  "items": [
    { "producto_id": 1, "cantidad": 2 },
    { "producto_id": 3, "cantidad": 1 }
  ]
}
```
**Respuesta 201:**
```json
{
  "id": 5,
  "total": 113.98,
  "estado": "pendiente",
  "items": [
    { "producto_id": 1, "cantidad": 2, "precio_unitario": 45.99 },
    { "producto_id": 3, "cantidad": 1, "precio_unitario": 22.00 }
  ]
}
```
**Respuesta 400** (si no hay stock suficiente o el producto no existe):
```json
{ "error": "Stock insuficiente para el producto 1" }
```

### Listar pedidos
```
GET /api/pedidos
```
Devuelve todos los pedidos ordenados por fecha (más reciente primero).

### Obtener el detalle de un pedido
```
GET /api/pedidos/:id
```
Devuelve el pedido junto con la lista de sus items (incluye el nombre del producto).

**Respuesta ejemplo:**
```json
{
  "id": 5,
  "fecha": "2026-07-09T20:00:00.000Z",
  "total": "113.98",
  "estado": "pendiente",
  "items": [
    {
      "id": 1,
      "pedido_id": 5,
      "producto_id": 1,
      "cantidad": 2,
      "precio_unitario": "45.99",
      "producto_nombre": "Audífonos Bluetooth"
    }
  ]
}
```

### Actualizar el estado de un pedido
```
PUT /api/pedidos/:id
```
**Body:**
```json
{ "estado": "completado" }
```
Valores válidos: `pendiente`, `completado`, `cancelado`.

---

## Códigos de estado usados

| Código | Significado |
|---|---|
| 200 | Operación exitosa (GET, PUT, DELETE) |
| 201 | Recurso creado exitosamente (POST) |
| 400 | Error de validación (ej. stock insuficiente) |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |
