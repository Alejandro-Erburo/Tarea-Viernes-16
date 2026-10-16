import type { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

import { tareasRepo } from '../repositories/tareas-repository.ts';

import {
  TareaSchema,
  CrearTareaSchema,
  ActualizarTareaSchema
} from '../schemas/tareas.ts';

const IdParamsSchema = Type.Object({
  id_tarea: Type.Integer({ minimum: 1 })
});

export async function tareasRoutes(app: FastifyInstance) {

  // GET /tareas
  app.get('/tareas', {
    schema: {
      response: {
        200: Type.Array(TareaSchema)
      }
    }
  }, async () => {
    return tareasRepo.obtenerTodas();
  });

  // GET /tareas/:id_tarea
  app.get('/tareas/:id_tarea', {
    schema: {
      params: IdParamsSchema,
      response: {
        200: TareaSchema
      }
    }
  }, async (request) => {
    const { id_tarea } = request.params as {
      id_tarea: number
    };

    return tareasRepo.obtenerPorId(id_tarea);
  });

  // POST /tareas
  app.post('/tareas', {
    schema: {
      body: CrearTareaSchema,
      response: {
        201: TareaSchema
      }
    }
  }, async (request, reply) => {
    const datos = request.body as typeof CrearTareaSchema.static;

    const tarea = await tareasRepo.crear(
      datos.id_creador,
      datos
    );

    return reply.code(201).send(tarea);
  });

  // PATCH /tareas/:id_tarea
  app.patch('/tareas/:id_tarea', {
    schema: {
      params: IdParamsSchema,
      body: ActualizarTareaSchema,
      response: {
        200: TareaSchema
      }
    }
  }, async (request) => {
    const { id_tarea } = request.params as {
      id_tarea: number
    };

    return tareasRepo.actualizar(
      id_tarea,
      request.body as typeof ActualizarTareaSchema.static
    );
  });

  // DELETE /tareas/:id_tarea
  app.delete('/tareas/:id_tarea', {
    schema: {
      params: IdParamsSchema
    }
  }, async (request, reply) => {
    const { id_tarea } = request.params as {
      id_tarea: number
    };

    await tareasRepo.eliminar(id_tarea);

    return reply.code(204).send();
  });
}