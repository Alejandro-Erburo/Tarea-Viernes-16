import { Type, type Static } from '@sinclair/typebox';

const GrupoSchema = Type.Union([
  Type.Literal('user'),
  Type.Literal('admin'),
  Type.Literal('superadmin')
]);

export const UsuarioSchema = Type.Object({
  id_usuario: Type.Integer(),
  username: Type.String({ maxLength: 30 }),
  nombres: Type.String(),
  apellidos: Type.String(),
  fecha_nacimiento: Type.String({ format: 'date' }),
  nombre_completo: Type.String(),
  grupos: Type.Array(GrupoSchema, { minItems: 1 }),
  activo: Type.Boolean()
});

export const CrearUsuarioSchema = Type.Object({
  username: Type.String({ minLength: 1, maxLength: 30 }),
  nombres: Type.String({ minLength: 1 }),
  apellidos: Type.String({ minLength: 1 }),
  fecha_nacimiento: Type.String({ format: 'date' }),
  grupos: Type.Array(GrupoSchema, { minItems: 1 })
});

export const ActualizarUsuarioSchema = Type.Partial(
  Type.Pick(UsuarioSchema, [
    'username',
    'nombres',
    'apellidos',
    'fecha_nacimiento',
    'grupos',
    'activo'
  ])
);

export type Usuario = Static<typeof UsuarioSchema>;
export type CrearUsuarioType = Static<typeof CrearUsuarioSchema>;
export type ActualizarUsuarioType = Static<typeof ActualizarUsuarioSchema>;