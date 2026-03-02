# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).


-------------------------------------------------------------------------------------------------------------------------------------------------------

## ⚙️ Configuración del proyecto

Sigue estos pasos en orden para poner el proyecto en marcha.

---

### 1. 📦 Instalar dependencias

```sh
npm install
```

---

### 2. 🔐 Crear el archivo de variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_URL=postgresql://[USUARIO]:[CONTRASEÑA]@[HOST]:[PUERTO]/[NOMBRE_BASE_DE_DATOS]
DIRECTDB_URL=postgresql://[USUARIO]:[CONTRASEÑA]@[HOST]:[PUERTO]/[NOMBRE_BASE_DE_DATOS]
```

> **Ejemplo con PostgreSQL local:**
> ```env
> DATABASE_URL=postgresql://postgres:admin@localhost:5432/mi_base_de_datos
> DIRECTDB_URL=postgresql://postgres:admin@localhost:5432/mi_base_de_datos
> ```

---

### 3. 🗄️ Aplicar migraciones a la base de datos

Ejecuta el siguiente comando reemplazando `[NOMBRE_DE_LA_MIGRACION]` por un nombre descriptivo (ej. `init`, `agregar_usuarios`):

```sh
npx prisma migrate dev --name [NOMBRE_DE_LA_MIGRACION]
```

> Esto crea las tablas en tu base de datos según los modelos definidos en `prisma/schema.prisma`.

---

### 4. 🔧 Generar el cliente de Prisma

```sh
npx prisma generate
```
> [!IMPORTANT]
> ⚠️ Este comando debe ejecutarse **cada vez que se apliquen nuevas migraciones**.

---

### 5. 🚀 Iniciar el servidor de desarrollo

```sh
npm run dev
```

El servidor estará disponible en `http://localhost:4321`.


