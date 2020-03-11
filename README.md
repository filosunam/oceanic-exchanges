# Intercambios oceánicos

Este proyecto funciona con Koa, React y Node.js. Contiene un **API server**, una **App** y un **Admin** donde se puede administrar o visualizar información a través de un usuario y contraseña.

Este proyecto se encuentra basado en [Marble Seeds](https://github.com/latteware/marble-seed).

### Instalación

Después de clonar el repositorio, necesitas instalar dependencias de NPM utilizando Yarn

```bash
$ yarn
```

Puedes encontrar todas las variables de entorno por defecto, así como puertos, bases de datos y servicios en **.env.default**, pero también dependiendo de tu entorno, puedes reemplazar y utilizar tus propias variables creando un archivo llamado **.env.development** o **.env.production**.

Para correr este proyecto y desarrollar en él (con *hot reload*), necesitas correr lo siguiente:

```bash
make api-server
make admin-server
make app-server
```

`make api-server` iniciará una API basada en Koa, `make admin-server` y `make app-server` iniciarán dos aplicaciones web en React. Por defecto, en la administración serás capaz de crear usuarios, roles y grupos, así como toda la información sensible que no quieras que sea pública.

Para crear el primer usuario administrador, ejecuta lo siguiente:

```bash
node tasks/create-admin --email admin@app.com --password foobar --screenName admin
```

Ahora, puedes abrir tu navegador a esta dirección http://localhost:5000/admin y entrar con el usuario y contraseña que acabas de crear para empezar a utilizar la administración.
By default, Marble Seeds have 3 different and powerfull tools to augment the user objects:

## Configuración en Producción

Si deseas configurar tu proyecto en producción, puedes utilizar Docker Compose para esto. Así, una vez que contribuyas a este proyecto y quieras liberar una funcionalidad a producción, primero asegúrate de construir los archivos estáticos corriendo lo siguiente:


```bash
make dist
```

Una vez creados los archivos estáticos, necesitarás reiniciar los contenedores de Docker Compose con lo siguiente:

```bash
docker-compose up -d --remove-orphans
```

Si quieres saber más información, revisar el siguiente enlace: https://www.notion.so/marbleform/Marble-seeds-server-from-0-e678d21f951546abae66f3f35bc7a420

