import pool from './connection';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

// Obtener todos los productos del catálogo
export async function getCatalogo() {
  const [rows] = await pool.query('SELECT * FROM catalogo');
  return rows;
}

// Obtener un producto por id
export async function getProductoPorId(id: number) {
  const [rows]: any = await pool.query('SELECT * FROM catalogo WHERE id = ?', [id]);
  return rows[0];
}

// Crear un nuevo producto
export async function crearProducto(producto: Producto) {
  const { nombre, descripcion, precio, stock } = producto;
  const [result]: any = await pool.query(
    'INSERT INTO catalogo (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
    [nombre, descripcion, precio, stock]
  );
  return { id: result.insertId, ...producto };
}

// Actualizar un producto existente
export async function actualizarProducto(id: number, producto: Producto) {
  const { nombre, descripcion, precio, stock } = producto;
  await pool.query(
    'UPDATE catalogo SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
    [nombre, descripcion, precio, stock, id]
  );
  return { id, ...producto };
}

// Eliminar un producto
export async function eliminarProducto(id: number) {
  await pool.query('DELETE FROM catalogo WHERE id = ?', [id]);
  return { mensaje: 'Producto eliminado', id };
}