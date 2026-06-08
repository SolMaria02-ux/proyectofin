import requests
from django.shortcuts import render

def home(request):
    response = requests.get('http://api:3000/api/catalogo')
    data = response.json()
    return render(request, 'index.html', {'data': data})