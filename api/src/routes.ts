import { Router } from 'express';
import {
  getProductos,
  getProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  getProductosStockBajo,
} from './producto';
import {
  getCategorias,
  getCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  getVentasPorCategoria,
} from './categoria';
import {
  crearPedido,
  getPedidos,
  getPedidoPorId,
  actualizarEstadoPedido,
} from './pedido';

const router = Router();

// ===== PRODUCTOS =====

router.get('/productos', async (req, res) => {
  try {
    const productos = await getProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/productos/bajo-stock', async (req, res) => {
  try {
    const limite = Number(req.query.limite) || 5;
    const productos = await getProductosStockBajo(limite);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos con stock bajo' });
  }
});

router.get('/productos/:id', async (req, res) => {
  try {
    const producto = await getProductoPorId(Number(req.params.id));
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = await crearProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

router.put('/productos/:id', async (req, res) => {
  try {
    const actualizado = await actualizarProducto(Number(req.params.id), req.body);
    if (!actualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/productos/:id', async (req, res) => {
  try {
    const resultado = await eliminarProducto(Number(req.params.id));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

// ===== CATEGORIAS =====

router.get('/categorias', async (req, res) => {
  try {
    const categorias = await getCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías' });
  }
});

router.get('/categorias/ventas', async (req, res) => {
  try {
    const ventas = await getVentasPorCategoria();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas por categoría' });
  }
});

router.get('/categorias/:id', async (req, res) => {
  try {
    const categoria = await getCategoriaPorId(Number(req.params.id));
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la categoría' });
  }
});

router.post('/categorias', async (req, res) => {
  try {
    const nuevaCategoria = await crearCategoria(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});

router.put('/categorias/:id', async (req, res) => {
  try {
    const actualizada = await actualizarCategoria(Number(req.params.id), req.body);
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});

router.delete('/categorias/:id', async (req, res) => {
  try {
    const resultado = await eliminarCategoria(Number(req.params.id));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});

// ===== PEDIDOS =====

router.post('/pedidos', async (req, res) => {
  try {
    const pedido = await crearPedido(req.body);
    res.status(201).json(pedido);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al crear el pedido' });
  }
});

router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await getPedidos();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});

router.get('/pedidos/:id', async (req, res) => {
  try {
    const pedido = await getPedidoPorId(Number(req.params.id));
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
});

router.put('/pedidos/:id', async (req, res) => {
  try {
    const resultado = await actualizarEstadoPedido(Number(req.params.id), req.body.estado);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
});

export default router;