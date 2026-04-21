🚗 AutoZone ITLA

Sistema web desarrollado con Ionic + React para la gestión de vehículos, gastos, ingresos y recursos de taller (como gomas), con una interfaz moderna basada en un sistema de diseño centralizado.

📌 Descripción

AutoZone ITLA es una aplicación que permite administrar:

- Vehículos  
- Gastos  
- Ingresos  
- Gomas (inventario)  
- Noticias  
- Videos  
- Usuarios  

El sistema está diseñado para ser escalable, moderno y organizado, utilizando un sistema de clases global (az-*) para mantener consistencia visual en toda la aplicación.

🧠 Tecnologías utilizadas

- React  
- Ionic React  
- CSS modular + sistema de diseño (theme/autozone.css)  
- API REST (backend propio)  
- TypeScript  

🎨 Sistema de Diseño

El proyecto utiliza un sistema centralizado de estilos ubicado en:

src/theme/autozone.css

Clases principales:

az-content → Contenedor principal  
az-card → Tarjetas  
az-field → Campo de formulario  
az-label → Labels  
az-input → Inputs y selects  
az-btn-primary → Botones  
az-error → Mensajes de error  

Esto evita duplicación de estilos y mantiene una UI consistente.

🧩 Estructura del proyecto

src/
│
├── pages/
│   ├── Gomas/
│   ├── Gastos/
│   ├── Noticias/
│   ├── Vehiculos/
│   ├── Dashboard/
│   └── ...
│
├── services/
│   └── api.ts
│
├── theme/
│   └── autozone.css
│
├── App.tsx
└── main.tsx

🚀 Instalación

1. Clonar el repositorio

git clone https://github.com/tu-usuario/autozone-itla.git
cd autozone-itla

2. Instalar dependencias

npm install

3. Ejecutar el proyecto

ionic serve

El sistema correrá en:

http://localhost:8100

⚙️ Configuración API

El proyecto consume un backend desde:

src/services/api.ts

Asegúrate de configurar correctamente la URL base:

const API_URL = 'http://localhost:3000';

📱 Módulos principales

Gomas:
- Registro de gomas
- Control de inventario
- Visualización en cards

Gastos / Ingresos:
- Registro por vehículo
- Categorización
- Listado dinámico

Noticias:
- Consumo de API externa
- Diseño tipo blog moderno

Vehículos:
- Registro y selección
- Base para operaciones

🧱 Buenas prácticas del proyecto

- No usar estilos inline innecesarios  
- No duplicar CSS global  
- Usar clases az-*  
- Mantener lógica separada de UI  
- Componentes limpios y reutilizables  

🔥 Estado del proyecto

Sistema funcional  
UI rediseñada  
Diseño centralizado implementado  
En mejora continua  

👨‍💻 Autor

Christofer Laurencio  
República Dominicana  
Laurens Soluciones Tecnológicas  

📄 Licencia

Este proyecto es de uso educativo y profesional.
