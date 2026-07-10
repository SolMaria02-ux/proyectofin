import { Router } from 'express';
import {
  getCatalogo,
  getProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from './catalogo';

const router = Router();

// GET /api/catalogo - obtener todos los productos
router.get('/catalogo', async (req, res) => {
  try {
    const productos = await getCatalogo();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el catálogo' });
  }
});

// GET /api/catalogo/:id - obtener un producto por id
router.get('/catalogo/:id', async (req, res) => {
  try {
    const producto = await getProductoPorId(Number(req.params.id));
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// POST /api/catalogo - crear un nuevo producto
router.post('/catalogo', async (req, res) => {
  try {
    const nuevoProducto = await crearProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// PUT /api/catalogo/:id - actualizar un producto
router.put('/catalogo/:id', async (req, res) => {
  try {
    const productoActualizado = await actualizarProducto(Number(req.params.id), req.body);
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// DELETE /api/catalogo/:id - eliminar un producto
router.delete('/catalogo/:id', async (req, res) => {
  try {
    const resultado = await eliminarProducto(Number(req.params.id));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;