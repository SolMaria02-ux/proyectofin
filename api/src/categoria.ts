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