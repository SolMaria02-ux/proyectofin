import pool from './connection';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria_id?: number;
}

export async function getProductos() {
  const [rows] = await pool.query(
    'SELECT * FROM producto WHERE stock > 0 ORDER BY nombre'
  );
  return rows;
}

export async function getProductoPorId(id: number) {
  const [rows]: any = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
  return rows[0];
}

export async function crearProducto(producto: Producto) {
  const { nombre, descripcion, precio, stock, categoria_id } = producto;
  const [result]: any = await pool.query(
    'INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, precio, stock, categoria_id ?? null]
  );
  return { id: result.insertId, ...producto };
}

export async function actualizarProducto(id: number, producto: Partial<Producto>) {
  const actual: any = await getProductoPorId(id);
  if (!actual) return null;

  const nombre = producto.nombre ?? actual.nombre;
  const descripcion = producto.descripcion ?? actual.descripcion;
  const precio = producto.precio ?? actual.precio;
  const stock = producto.stock ?? actual.stock;
  const categoria_id = producto.categoria_id ?? actual.categoria_id;

  await pool.query(
    'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?',
    [nombre, descripcion, precio, stock, categoria_id, id]
  );
  return { id, nombre, descripcion, precio, stock, categoria_id };
}

export async function eliminarProducto(id: number) {
  await pool.query('DELETE FROM producto WHERE id = ?', [id]);
  return { mensaje: 'Producto eliminado', id };
}

export async function getProductosStockBajo(limite: number) {
  const [rows] = await pool.query(
    'SELECT * FROM producto WHERE stock < ? ORDER BY stock ASC',
    [limite]
  );
  return rows;
}