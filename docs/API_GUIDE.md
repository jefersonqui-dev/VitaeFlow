# Guía de Pruebas de API (Postman / cURL)

Para probar la autenticación antes de conectar el frontend, sigue estos pasos.

## 1. Prerrequisitos

1. Asegúrate de tener **MongoDB** corriendo localmente o actualiza `MONGO_URI` en `backend/.env`.
2. Inicia el servidor backend:
   ```bash
   npm run dev:backend
   ```
   (Deberías ver: `Server running on port 5000` y `MongoDB Connected...`)

## 2. Endpoints de Autenticación

### A. Registrar un Nuevo Usuario (Register)

Crea un usuario para poder loguearte después.

- **Método:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Usuario Test",
    "email": "test@example.com",
    "password": "password123"
  }
  ```

**Respuesta Esperada (201 Created):**
```json
{
  "_id": "64d...",
  "name": "Usuario Test",
  "email": "test@example.com",
  "token": "eyJhbG..."
}
```

---

### B. Iniciar Sesión (Login)

Obtén el token JWT para usar en el frontend o requests protegidas.

- **Método:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```

**Respuesta Esperada (200 OK):**
```json
{
  "_id": "64d...",
  "name": "Usuario Test",
  "email": "test@example.com",
  "token": "eyJhbG..."
}
```

## 3. Próximos Pasos en el Frontend

1. Copia el `email` y `password` usados aquí.
2. Ve a `http://localhost:3000/login` en tu navegador.
3. Ingresa las credenciales.
4. Si el login es exitoso, serás redirigido al Editor.
