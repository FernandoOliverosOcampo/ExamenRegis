# ExamenRegis - Sistema de Evaluación Electoral

Sistema de examen en línea para evaluación de conocimientos electorales con preguntas aleatorias y panel de administración.

## Características

- **Examen aleatorio**: 20 preguntas seleccionadas aleatoriamente de un banco de 40 preguntas
- **Calificación automática**: Sistema de calificación de 1 a 100 puntos
- **Panel de administración**: Interfaz para ver respuestas correctas, configurar tiempo y ver usuarios
- **Base de datos centralizada**: MongoDB Atlas para almacenamiento de configuración y usuarios
- **Serverless Functions**: Netlify Functions para backend sin servidor

## Estructura del Proyecto

```
ExamenRegis-main/
├── index.html              # Página principal del examen
├── admin.html              # Panel de administración
├── package.json            # Dependencias de Node.js
├── netlify.toml            # Configuración de Netlify
└── netlify/
    └── functions/
        ├── guardar-config.js      # Guardar configuración de fecha de cierre
        ├── obtener-config.js      # Obtener configuración de fecha de cierre
        ├── registrar-usuario.js   # Registrar usuario que ingresa al examen
        ├── listar-usuarios.js     # Listar todos los usuarios registrados
        └── limpiar-usuarios.js    # Limpiar todos los usuarios
```

## Configuración Inicial

### 1. Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta gratuita
2. Crea un nuevo cluster (selecciona el tier gratuito "M0")
3. Configura Database Access:
   - Crea un usuario de base de datos
   - Asigna permisos de lectura y escritura
4. Configura Network Access:
   - Agrega `0.0.0.0/0` para permitir acceso desde cualquier IP (o tu IP específica)
5. Obtén el connection string:
   - Clusters → Connect → Connect your application
   - Copia el connection string (ejemplo: `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/`)

### 2. Configurar Variables de Entorno en Netlify

1. Sube tu proyecto a Netlify (via Git o drag-and-drop)
2. Ve a Site Settings → Environment variables
3. Agrega las siguientes variables:

```
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.xxxxx.mongodb.net/examen?retryWrites=true&w=majority
ADMIN_PASSWORD=admin123
```

**Importante**: Reemplaza `TU_USUARIO` y `TU_PASSWORD` con tus credenciales reales de MongoDB.

### 3. Instalar Dependencias

En tu directorio local, ejecuta:

```bash
npm install
```

Esto instalará el driver de MongoDB necesario para las Netlify Functions.

## Despliegue en Netlify

### Opción A: Via Git (Recomendado)

1. Sube tu código a GitHub/GitLab/Bitbucket
2. En Netlify, crea un nuevo sitio desde tu repositorio
3. Configura las variables de entorno (ver paso 2)
4. Netlify detectará automáticamente las funciones y las desplegará

### Opción B: Via Drag-and-Drop

1. Ejecuta `npm install` localmente para crear `node_modules`
2. Comprime todo el proyecto (incluyendo `node_modules`)
3. Arrastra el archivo .zip al dashboard de Netlify
4. Configura las variables de entorno

## Uso del Sistema

### Para los Usuarios

1. Acceden a `index.html`
2. Ingresan su número de cédula
3. El sistema verifica si ya han presentado el examen
4. Si es nuevo, se muestran 20 preguntas aleatorias
5. Al enviar, se calcula la calificación automáticamente

### Para el Administrador

1. Acceden a `admin.html`
2. Ingresan la contraseña (por defecto: `admin123`)
3. Pueden:
   - **Ver respuestas**: Consultar todas las preguntas con sus respuestas correctas
   - **Configurar tiempo**: Modificar la fecha y hora de cierre del examen
   - **Ver usuarios**: Listar todos los usuarios que han ingresado al examen
   - **Limpiar registros**: Eliminar todos los usuarios registrados

## Seguridad

- La contraseña del panel de administración está configurada en la variable de entorno `ADMIN_PASSWORD`
- Las credenciales de MongoDB están en la variable de entorno `MONGODB_URI`
- Para producción, se recomienda:
  - Usar contraseñas más seguras
  - Implementar autenticación más robusta (JWT, OAuth, etc.)
  - Restringir el acceso IP en MongoDB Atlas
  - Usar HTTPS (Netlify lo proporciona por defecto)

## API Endpoints

Las Netlify Functions están disponibles en:

- `POST /.netlify/functions/guardar-config` - Guardar configuración de fecha de cierre
- `GET /.netlify/functions/obtener-config` - Obtener configuración de fecha de cierre
- `POST /.netlify/functions/registrar-usuario` - Registrar usuario que ingresa
- `GET /.netlify/functions/listar-usuarios` - Listar todos los usuarios
- `DELETE /.netlify/functions/limpiar-usuarios` - Eliminar todos los usuarios

## Troubleshooting

### Error de conexión a MongoDB

- Verifica que la variable de entorno `MONGODB_URI` esté correctamente configurada
- Asegúrate de que la IP whitelist en MongoDB Atlas permita el acceso
- Verifica que el usuario de base de datos tenga los permisos correctos

### Las funciones no responden

- Verifica que `package.json` esté presente y que `npm install` se haya ejecutado
- Revisa los logs de Netlify Functions en el dashboard de Netlify
- Asegúrate de que `netlify.toml` esté configurado correctamente

### Los usuarios no se registran

- Verifica que la función `registrar-usuario.js` esté desplegada correctamente
- Revisa los logs de Netlify para ver si hay errores
- Verifica la conexión a MongoDB

## Soporte

Para problemas o preguntas, revisa la documentación de:
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)