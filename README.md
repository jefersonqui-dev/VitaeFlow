# VitaeFlow - Professional Resume Builder SaaS

**VitaeFlow** es una plataforma SaaS moderna y robusta diseñada para la creación, edición y gestión profesional de currículums (CV). Construida con una arquitectura de microservicios y monorepo, ofrece una experiencia de edición en tiempo real y generación de PDFs de alta fidelidad.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tech](https://img.shields.io/badge/stack-MERN-blueviolet.svg)

## 🌟 Características Principales

-   **Editor en Tiempo Real:** Interfaz reactiva para editar datos personales, experiencia, educación y habilidades.
-   **Generación PDF Pixel-Perfect:** Utiliza `Puppeteer` en workers aislados para renderizar PDFs idénticos a la vista previa HTML.
-   **Sistema de Archivos Híbrido:** Soporte inteligente para subir fotos de perfil localmente (en desarrollo) o directamente a **AWS S3** (en producción) mediante URLs firmadas.
-   **Autenticación Segura:** Sistema completo de registro y login con JWT y protección de rutas.
-   **Arquitectura Escalable:** Separación clara entre Frontend, Backend API y Workers de generación de PDF.

## 🛠 Tech Stack

### Frontend (`/frontend`)
-   **Framework:** React 18 + Vite
-   **Estado:** Redux Toolkit
-   **Estilos:** TailwindCSS
-   **Lenguaje:** TypeScript

### Backend (`/backend`)
-   **Runtime:** Node.js + Express
-   **Base de Datos:** MongoDB (Mongoose)
-   **Seguridad:** Helmet, CORS, JWT
-   **Almacenamiento:** Multer (Local) / AWS SDK v3 (S3)

### Workers (`/workers`)
-   **Motor PDF:** Puppeteer Core + Chrome AWS Lambda
-   **Infraestructura:** Serverless ready (AWS Lambda compatible)

## 🚀 Instalación y Uso

### Prerrequisitos
-   Node.js (v18+)
-   MongoDB (corriendo localmente)

### 1. Clonar e Instalar
```bash
git clone <tu-repo-url>
cd vitaeflow
npm install
```

### 2. Configuración (.env)
El sistema crea automáticamente archivos `.env` básicos, pero asegúrate de revisarlos.

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume-saas
JWT_SECRET=tu_secreto_seguro
# AWS (Opcional para Dev - El sistema usará almacenamiento local si no están)
AWS_ACCESS_KEY_ID=...
```

### 3. Ejecutar en Desarrollo
Para levantar toda la infraestructura (Frontend + Backend + Workers), abre 3 terminales:

**Terminal 1 (Backend API):**
```bash
npm run dev:backend
```

**Terminal 2 (Frontend):**
```bash
npm run dev:frontend
```

**Terminal 3 (Worker PDF):**
```bash
# Windows PowerShell
$env:IS_LOCAL="true"; npm run dev -w workers

# Mac/Linux
IS_LOCAL=true npm run dev -w workers
```

## 📂 Estructura del Proyecto

```
vitaeflow/
├── backend/         # API REST y Lógica de Negocio
├── frontend/        # SPA React
├── workers/         # Microservicio de generación PDF
├── docs/            # Documentación adicional
└── uploads/         # Almacenamiento local de imágenes (creado automáticamente)
```

## 🤝 Contribución
Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir lo que te gustaría cambiar.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.
