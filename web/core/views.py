import requests
from django.shortcuts import render, redirect

API_URL = 'http://api:3000/api'


def catalogo(request):
    categoria_id = request.GET.get('categoria')

    productos_resp = requests.get(f'{API_URL}/productos')
    productos = productos_resp.json()

    categorias_resp = requests.get(f'{API_URL}/categorias')
    categorias = categorias_resp.json()

    if categoria_id:
        productos = [p for p in productos if str(p.get('categoria_id')) == str(categoria_id)]

    return render(request, 'catalogo.html', {
        'productos': productos,
        'categorias': categorias,
        'categoria_seleccionada': categoria_id,
    })


def agregar_al_carrito(request, producto_id):
    carrito = request.session.get('carrito', {})
    producto_id = str(producto_id)
    carrito[producto_id] = carrito.get(producto_id, 0) + 1
    request.session['carrito'] = carrito
    return redirect('catalogo')


def ver_carrito(request):
    carrito = request.session.get('carrito', {})
    items = []
    total = 0

    for producto_id, cantidad in carrito.items():
        resp = requests.get(f'{API_URL}/productos/{producto_id}')
        if resp.status_code == 200:
            producto = resp.json()
            subtotal = float(producto['precio']) * cantidad
            total += subtotal
            items.append({
                'producto': producto,
                'cantidad': cantidad,
                'subtotal': subtotal,
            })

    return render(request, 'carrito.html', {'items': items, 'total': total})


def quitar_del_carrito(request, producto_id):
    carrito = request.session.get('carrito', {})
    producto_id = str(producto_id)
    if producto_id in carrito:
        del carrito[producto_id]
    request.session['carrito'] = carrito
    return redirect('ver_carrito')


def confirmar_pedido(request):
    carrito = request.session.get('carrito', {})

    if not carrito:
        return redirect('catalogo')

    items = [
        {'producto_id': int(pid), 'cantidad': cantidad}
        for pid, cantidad in carrito.items()
    ]

    resp = requests.post(f'{API_URL}/pedidos', json={'items': items})

    if resp.status_code == 201:
        request.session['carrito'] = {}
        pedido = resp.json()
        return render(request, 'pedido_confirmado.html', {'pedido': pedido})
    else:
        error = resp.json().get('error', 'Error al crear el pedido')
        return render(request, 'carrito.html', {
            'items': [],
            'total': 0,
            'error': error,
        })


def historial_pedidos(request):
    resp = requests.get(f'{API_URL}/pedidos')
    pedidos = resp.json()
    return render(request, 'historial_pedidos.html', {'pedidos': pedidos})


# ===== CATEGORIAS (CRUD) =====

def listar_categorias(request):
    resp = requests.get(f'{API_URL}/categorias')
    categorias = resp.json()
    return render(request, 'categorias.html', {'categorias': categorias})


def crear_categoria(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        requests.post(f'{API_URL}/categorias', json={
            'nombre': nombre,
            'descripcion': descripcion,
        })
        return redirect('listar_categorias')

    return render(request, 'categoria_form.html', {'categoria': None})


def editar_categoria(request, categoria_id):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        requests.put(f'{API_URL}/categorias/{categoria_id}', json={
            'nombre': nombre,
            'descripcion': descripcion,
        })
        return redirect('listar_categorias')

    resp = requests.get(f'{API_URL}/categorias/{categoria_id}')
    categoria = resp.json()
    return render(request, 'categoria_form.html', {'categoria': categoria})


def eliminar_categoria(request, categoria_id):
    requests.delete(f'{API_URL}/categorias/{categoria_id}')
    return redirect('listar_categorias')


# ===== PRODUCTOS (CRUD) =====

def listar_productos_admin(request):
    resp = requests.get(f'{API_URL}/productos')
    productos = resp.json()

    categorias_resp = requests.get(f'{API_URL}/categorias')
    categorias = categorias_resp.json()

    # Mapear categoria_id -> nombre para mostrarlo en la tabla
    categorias_por_id = {cat['id']: cat['nombre'] for cat in categorias}
    for prod in productos:
        prod['categoria_nombre'] = categorias_por_id.get(prod.get('categoria_id'), 'Sin categoría')

    return render(request, 'productos_admin.html', {
        'productos': productos,
        'categorias': categorias,
    })


def crear_producto(request):
    categorias_resp = requests.get(f'{API_URL}/categorias')
    categorias = categorias_resp.json()

    if request.method == 'POST':
        data = {
            'nombre': request.POST.get('nombre'),
            'descripcion': request.POST.get('descripcion'),
            'precio': request.POST.get('precio'),
            'stock': request.POST.get('stock'),
            'categoria_id': request.POST.get('categoria_id'),
        }
        requests.post(f'{API_URL}/productos', json=data)
        return redirect('listar_productos_admin')

    return render(request, 'producto_form.html', {'producto': None, 'categorias': categorias})


def editar_producto(request, producto_id):
    categorias_resp = requests.get(f'{API_URL}/categorias')
    categorias = categorias_resp.json()

    if request.method == 'POST':
        data = {
            'nombre': request.POST.get('nombre'),
            'descripcion': request.POST.get('descripcion'),
            'precio': request.POST.get('precio'),
            'stock': request.POST.get('stock'),
            'categoria_id': request.POST.get('categoria_id'),
        }
        requests.put(f'{API_URL}/productos/{producto_id}', json=data)
        return redirect('listar_productos_admin')

    resp = requests.get(f'{API_URL}/productos/{producto_id}')
    producto = resp.json()
    return render(request, 'producto_form.html', {'producto': producto, 'categorias': categorias})


def eliminar_producto(request, producto_id):
    requests.delete(f'{API_URL}/productos/{producto_id}')
    return redirect('listar_productos_admin')
# ===== CONSULTAS DE NEGOCIO =====
 
def productos_stock_bajo(request):
    limite = request.GET.get('limite', 5)
    resp = requests.get(f'{API_URL}/productos/bajo-stock', params={'limite': limite})
    productos = resp.json()
    return render(request, 'stock_bajo.html', {
        'productos': productos,
        'limite': limite,
    })
 
 
def ventas_por_categoria(request):
    resp = requests.get(f'{API_URL}/categorias/ventas')
    ventas = resp.json()
    return render(request, 'ventas_categoria.html', {'ventas': ventas})
    
    # ===== PEDIDO — DETALLE Y CAMBIO DE ESTADO =====

def detalle_pedido(request, pedido_id):
    resp = requests.get(f'{API_URL}/pedidos/{pedido_id}')
    if resp.status_code != 200:
        return redirect('historial_pedidos')
    pedido = resp.json()

    # Calcular subtotal de cada item y agregar nombre del producto
    for item in pedido.get('items', []):
        item['subtotal'] = float(item['cantidad']) * float(item['precio_unitario'])
        prod_resp = requests.get(f'{API_URL}/productos/{item["producto_id"]}')
        if prod_resp.status_code == 200:
            item['producto_nombre'] = prod_resp.json().get('nombre', 'Producto')
        else:
            item['producto_nombre'] = f'Producto #{item["producto_id"]}'

    return render(request, 'pedido_detalle.html', {'pedido': pedido})


def cambiar_estado_pedido(request, pedido_id):
    if request.method == 'POST':
        nuevo_estado = request.POST.get('estado')
        requests.put(f'{API_URL}/pedidos/{pedido_id}', json={'estado': nuevo_estado})
    return redirect('historial_pedidos')