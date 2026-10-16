import { myPool } from "../db/database.ts";
import {
  NotAuthorizedError,
  NotFoundError,
} from "../errors/response.errors.ts";
import type {
  ActualizarUsuarioType,
  CrearUsuarioType,
  Usuario,
} from "../schemas/usuarios.ts";

class UsuariosRepository {
  private readonly baseQuery = `
    SELECT * FROM usuarios U
  `;

  async obtenerTodos(): Promise<Usuario[]> {
    const query = `
      ${this.baseQuery}
      ORDER BY id_usuario ASC;
    `;
    const result = await myPool.query(query);
    return result.rows;
  }

  async obtenerPorId(idUsuario: number): Promise<Usuario> {
    const query = `
      ${this.baseQuery}
      WHERE id_usuario = $1;
    `;
    const result = await myPool.query(query, [idUsuario]);
    if (result.rowCount !== 1)
      throw new NotFoundError("Usuario no encontrado.");
    return result.rows[0];
  }

  async obtenerPorUsername(username: string): Promise<Usuario> {
    const query = `
      ${this.baseQuery}
      WHERE username = $1;
    `;
    const result = await myPool.query(query, [username]);
    if (result.rowCount !== 1)
      throw new NotFoundError("Usuario no encontrado.");
    return result.rows[0];
  }

  async crear(dto: CrearUsuarioType): Promise<Usuario> {
    const resultado = await myPool.query<Usuario>(
      `INSERT INTO usuarios
        (username, nombres, apellidos, fecha_nacimiento, grupos)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        dto.username,
        dto.nombres,
        dto.apellidos,
        dto.fecha_nacimiento,
        dto.grupos
      ]
    );

    return resultado.rows[0];
  }

  async actualizar(
    idUsuario: number,
    dto: ActualizarUsuarioType,
  ): Promise<Usuario> {
    const campos: string[] = [];
    const valores: any[] = [];
    let idx = 1;

    if (dto.username !== undefined) {
      campos.push(`username = $${idx++}`);
      valores.push(dto.username);
    }
    if (dto.nombres !== undefined) {
      campos.push(`nombres = $${idx++}`);
      valores.push(dto.nombres);
    }
    if (dto.apellidos !== undefined) {
      campos.push(`apellidos = $${idx++}`);
      valores.push(dto.apellidos);
    }
    if (dto.fecha_nacimiento !== undefined) {
      campos.push(`fecha_nacimiento = $${idx++}`);
      valores.push(dto.fecha_nacimiento);
    }
    if (dto.grupos !== undefined) {
      campos.push(`grupos = $${idx++}`);
      valores.push(dto.grupos);
    }
    if (dto.activo !== undefined) {
      campos.push(`activo = $${idx++}`);
      valores.push(dto.activo);
    }

    if (campos.length === 0) {
      return this.obtenerPorId(idUsuario);
    }

    valores.push(idUsuario);
    const query = `
      UPDATE usuarios
      SET ${campos.join(", ")}
      WHERE id_usuario = $${idx};
    `;

    await myPool.query(query, valores);
    return this.obtenerPorId(idUsuario);
  }

  async eliminar(idUsuario: number): Promise<boolean> {
    const query = `
      DELETE FROM usuarios
      WHERE id_usuario = $1;
    `;
    const result = await myPool.query(query, [idUsuario]);

    return (result.rowCount ?? 0) > 0;
  }

  async verificarCredenciales(
    username: string,
    passwordPlana: string,
  ): Promise<Usuario> {
    const query = `
      ${this.baseQuery}
      JOIN credenciales c ON u.id_usuario = c.id_usuario
      WHERE u.username = $1  AND u.activo = TRUE AND c.password_hash = crypt($2, c.password_hash);
    `;
    const result = await myPool.query(query, [username, passwordPlana]);
    if (result.rowCount !== 1)
      throw new NotAuthorizedError("Usuario no encontrado.");
    return result.rows[0];
  }
}
export const usuariosRepo = new UsuariosRepository();
