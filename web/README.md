# Crear entorno virutal (venv)
```
python3 -m venv venv
```
# Activar entorno virtual
```
source venv/bin/activate
```
# Instalar dependencias
```
pip install django requests mysqlclient
```
# Crear proyecto
```
django-admin startproject config .
python manage.py startapp core
```