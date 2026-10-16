import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

import { usuariosRepo } from '../repositories/usuarios-repository.ts';

import {
  UsuarioSchema,
  CrearUsuarioSchema,
  ActualizarUsuarioSchema
} from '../schemas/usuarios.ts';

const IdParamsSchema = Type.Object({
  id_usuario: Type.Integer({ minimum: 1 })
});

const ErrorSchema = Type.Object({
  mensaje: Type.String()
});

export async function usuariosRoutes(app: FastifyInstance) {
  
    // POST /auth/login
    app.post('/auth/login', {
        schema: {
        body: Type.Object({
            username: Type.String({ minLength: 1 }),
            password: Type.String({ minLength: 1 })
        }),
        response: {
            200: Type.Object({
            token: Type.String(),
            usuario: UsuarioSchema
            }),
            401: ErrorSchema
        }
        }
    }, async (request, reply) => {
        const { username, password } = request.body as {
        username: string;
        password: string;
        };

        try {
        const usuario = await usuariosRepo.verificarCredenciales(
            username,
            password
        );

        const token = app.jwt.sign(
            { id_usuario: usuario.id_usuario },
            { expiresIn: '1h' }
        );

        return { token, usuario };
        } catch {
        return reply.code(401).send({
            mensaje: 'Credenciales incorrectas'
        });
        }
    });

    // GET /usuarios/me
    app.get('/usuarios/me', {
        schema: {
        security: [{ bearerAuth: [] }],
        response: {
            200: UsuarioSchema,
            401: ErrorSchema
        }
        }
    }, async (request, reply) => {
        try {
        await request.jwtVerify();

        const payload = request.user as {
            id_usuario: number;
        };

        return await usuariosRepo.obtenerPorId(payload.id_usuario);
        } catch {
        return reply.code(401).send({
            mensaje: 'No autorizado'
        });
        }
    });

    // GET /usuarios
    app.get('/usuarios', {
        schema: {
        response: {
            200: Type.Array(UsuarioSchema)
        }
        }
    }, async () => {
        return usuariosRepo.obtenerTodos();
    });

    // GET /usuarios/:id_usuario
    app.get('/usuarios/:id_usuario', {
        schema: {
        params: IdParamsSchema,
        response: {
            200: UsuarioSchema
        }
        }
    }, async (request) => {
        const { id_usuario } = request.params as {
        id_usuario: number
        };

        return usuariosRepo.obtenerPorId(id_usuario);
    });

    // POST /usuarios
    app.post('/usuarios', {
        schema: {
        body: CrearUsuarioSchema,
        response: {
            201: UsuarioSchema
        }
        }
    }, async (request, reply) => {
        const usuario = await usuariosRepo.crear(
        request.body as typeof CrearUsuarioSchema.static
        );

        return reply.code(201).send(usuario);
    });

    // PATCH /usuarios/:id_usuario
    app.patch('/usuarios/:id_usuario', {
        schema: {
        params: IdParamsSchema,
        body: ActualizarUsuarioSchema,
        response: {
            200: UsuarioSchema
        }
        }
    }, async (request) => {
        const { id_usuario } = request.params as {
        id_usuario: number
        };

        return usuariosRepo.actualizar(
        id_usuario,
        request.body as typeof ActualizarUsuarioSchema.static
        );
    });

    // DELETE /usuarios/:id_usuario
    app.delete('/usuarios/:id_usuario', {
        schema: {
        params: IdParamsSchema
        }
    }, async (request, reply) => {
        const { id_usuario } = request.params as {
        id_usuario: number
        };

        const eliminado = await usuariosRepo.eliminar(id_usuario);

        if (!eliminado) {
        return reply.code(404).send({
            mensaje: 'Usuario no encontrado'
        });
        }

        return reply.code(204).send();
    });
}