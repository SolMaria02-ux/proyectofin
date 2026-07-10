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