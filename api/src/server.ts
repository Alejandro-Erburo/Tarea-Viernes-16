import Fastify from 'fastify';
import 'dotenv/config';
import { myPool } from './db/database.ts';
import { usuariosRoutes } from './routes/usuarios.routes.ts';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { tareasRoutes } from './routes/tareas.routes.ts';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';

const app = Fastify({
  logger: true
});

await app.register(swagger, {
  openapi: {
    info: {
      title: 'API de Usuarios y Tareas',
      description: 'API REST para gestionar usuarios y tareas',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
});

await app.register(swaggerUI, {
  routePrefix: '/docs'
});

await app.register(cors, {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200']
});

await app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? ''
});

await app.register(usuariosRoutes);
await app.register(tareasRoutes);

app.get('/', async () => {
  return { mensaje: 'API funcionando correctamente' };
});

const iniciarServidor = async () => {
  try {
    await app.listen({
      port: 3000,
      host: '127.0.0.1'
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

iniciarServidor();