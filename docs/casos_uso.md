## Índice

- [Índice General](../README.md)
- [Catálogo](actions_catalogo.md)


# 📌 Diagrama de Flujo – Interacciones con la API REST

Este diagrama muestra el flujo de llamadas entre los usuarios (o sistemas externos) y la API REST, incluyendo la validación del token y las operaciones disponibles.

---

## 🔁 Flujo de Interacción

```mermaid
sequenceDiagram
    participant Usuario
    participant API as API REST
    participant BD as Base de Datos

    Usuario->>API: Iniciar sesión (POST /api/login)
    API->>BD: Validar credenciales
    BD-->>API: Usuario válido
    API-->>Usuario: Token JWT

    Usuario->>API: Subir documento (POST /api/store/createdoc)
    API->>API: Validar token
    API->>BD: Guardar documento
    BD-->>API: Confirmación
    API-->>Usuario: Documento registrado

    Usuario->>API: Consultar documentos (POST /api/store/getdocuments)
    API->>API: Validar token
    API->>BD: Buscar documentos
    BD-->>API: Lista de documentos
    API-->>Usuario: Respuesta con documentos

    Usuario->>API: Consultar morosidad (POST /api/student/morosidad)
    API->>API: Validar token
    API->>BD: Consultar morosidad
    BD-->>API: Resultado
    API-->>Usuario: Estado de morosidad
