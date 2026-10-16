import { Type, type Static } from '@sinclair/typebox';

const GrupoSchema = Type.Union([
  Type.Literal('user'),
  Type.Literal('admin'),
  Type.Literal('superadmin')
]);

const PrioridadSchema = Type.Union([
  Type.Literal('0:baja'),
  Type.Literal('1:media'),
  Type.Literal('2:alta')
]);

export const TareaSchema = Type.Object({
  id_tarea: Type.Integer(),
  id_creador: Type.Integer(),
  grupo: GrupoSchema,
  titulo: Type.String(),
  descripcion: Type.Union([Type.String(), Type.Null()]),
  prioridad: PrioridadSchema,
  creada: Type.String(),
  terminada: Type.Union([Type.String(), Type.Null()]),
  estado: Type.String()
});

export const CrearTareaSchema = Type.Object({
  id_creador: Type.Integer({ minimum: 1 }),
  grupo: GrupoSchema,
  titulo: Type.String({ minLength: 1, maxLength: 100 }),
  descripcion: Type.Optional(Type.String()),
  prioridad: Type.Optional(PrioridadSchema)
});

export const ActualizarTareaSchema = Type.Partial(
  Type.Pick(CrearTareaSchema, [
    'grupo',
    'titulo',
    'descripcion',
    'prioridad'
  ])
);

export type Tarea = Static<typeof TareaSchema>;
export type CrearTareaType = Static<typeof CrearTareaSchema>;
export type ActualizarTareaType = Static<typeof ActualizarTareaSchema>;