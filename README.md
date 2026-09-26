# Desafío - Tienda de Joyas

API REST desarrollada con **Node.js, Express y PostgreSQL** para gestionar el inventario de una tienda de joyas.

## Tecnologías

* Node.js
* Express
* PostgreSQL
* pg
* dotenv
* Nodemon

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=joyas
DB_PASSWORD=TU_CONTRASEÑA
DB_PORT=5432
PORT=3000
```

La estructura de la base de datos y los datos iniciales se encuentran en `database.sql`.

## Ejecutar

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Servidor:

```text
http://localhost:3000
```

## Rutas principales

### Obtener joyas

```text
GET /joyas
```

Parámetros opcionales:

```text
limits
page
order_by
```

Ejemplo:

```text
/joyas?limits=3&page=1&order_by=stock_ASC
```

### Filtrar joyas

```text
GET /joyas/filtros
```

Parámetros:

```text
precio_min
precio_max
categoria
metal
```

Ejemplo:

```text
/joyas/filtros?precio_min=25000&precio_max=30000&categoria=aros&metal=plata
```

### Obtener una joya

```text
GET /joyas/:id
```

Ejemplo:

```text
/joyas/3
```

El proyecto incorpora **HATEOAS, paginación, ordenamiento, filtros, middleware de reportes, manejo de errores con try/catch y consultas SQL parametrizadas**.

