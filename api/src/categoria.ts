import pool from './connection';

export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
}

export async function getCategorias() {
  const [rows] = await pool.query('SELECT * FROM categoria ORDER BY nombre');
  return rows;
}

export async function getCategoriaPorId(id: number) {
  const [rows]: any = await pool.query('SELECT * FROM categoria WHERE id = ?', [id]);
  return rows[0];
}

export async function crearCategoria(categoria: Categoria) {
  const { nombre, descripcion } = categoria;
  const [result]: any = await pool.query(
    'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion ?? null]
  );
  return { id: result.insertId, ...categoria };
}

export async function actualizarCategoria(id: number, categoria: Categoria) {
  const { nombre, descripcion } = categoria;
  await pool.query(
    'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?',
    [nombre, descripcion ?? null, id]
  );
  return { id, nombre, descripcion };
}

export async function eliminarCategoria(id: number) {
  await pool.query('DELETE FROM categoria WHERE id = ?', [id]);
  return { mensaje: 'Categoría eliminada', id };
}

export async function getVentasPorCategoria() {
  const [rows] = await pool.query(`
    SELECT
      c.id AS categoria_id,
      c.nombre AS categoria,
      COALESCE(SUM(ip.cantidad * ip.precio_unitario), 0) AS total_vendido
    FROM categoria c
    LEFT JOIN producto p ON p.categoria_id = c.id
    LEFT JOIN item_pedido ip ON ip.producto_id = p.id
    GROUP BY c.id, c.nombre
    ORDER BY total_vendido DESC
  `);
  return rows;
}