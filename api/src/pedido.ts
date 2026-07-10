import pool from './connection';

export interface ItemPedidoInput {
  producto_id: number;
  cantidad: number;
}

export interface PedidoInput {
  items: ItemPedidoInput[];
}

export async function crearPedido(pedidoInput: PedidoInput) {
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    let total = 0;
    const itemsConPrecio: Array<ItemPedidoInput & { precio_unitario: number }> = [];

    for (const item of pedidoInput.items) {
      const [rows]: any = await conexion.query(
        'SELECT precio, stock FROM producto WHERE id = ? FOR UPDATE',
        [item.producto_id]
      );
      const producto = rows[0];

      if (!producto) {
        throw new Error(`Producto ${item.producto_id} no existe`);
      }
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ${item.producto_id}`);
      }

      total += producto.precio * item.cantidad;
      itemsConPrecio.push({ ...item, precio_unitario: producto.precio });
    }

    const [resultPedido]: any = await conexion.query(
      'INSERT INTO pedido (total, estado) VALUES (?, ?)',
      [total, 'pendiente']
    );
    const pedidoId = resultPedido.insertId;

    for (const item of itemsConPrecio) {
      await conexion.query(
        'INSERT INTO item_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]
      );
      await conexion.query(
        'UPDATE producto SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    await conexion.commit();
    return { id: pedidoId, total, estado: 'pendiente', items: itemsConPrecio };
  } catch (error) {
    await conexion.rollback();
    throw error;
  } finally {
    conexion.release();
  }
}

export async function getPedidos() {
  const [rows] = await pool.query('SELECT * FROM pedido ORDER BY fecha DESC');
  return rows;
}

export async function getPedidoPorId(id: number) {
  const [pedidoRows]: any = await pool.query('SELECT * FROM pedido WHERE id = ?', [id]);
  const pedido = pedidoRows[0];
  if (!pedido) return null;

  const [items] = await pool.query(
    `SELECT ip.*, p.nombre AS producto_nombre
     FROM item_pedido ip
     JOIN producto p ON p.id = ip.producto_id
     WHERE ip.pedido_id = ?`,
    [id]
  );

  return { ...pedido, items };
}

export async function actualizarEstadoPedido(id: number, estado: string) {
  await pool.query('UPDATE pedido SET estado = ? WHERE id = ?', [estado, id]);
  return { id, estado };
}