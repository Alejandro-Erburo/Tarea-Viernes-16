import { Usuario } from '../models/usuario.model'

export const USUARIOS_INICIALES: Usuario[] = [
    {
        id_usuario: 1,
        username: 'jperez',
        nombres: 'Juan',
        apellidos: 'Pérez',
        fecha_nacimiento: '2000-05-15',
        nombre_completo: 'Juena Pérez',
        grupos: ['user'],
        activo: true
    },
    {
        id_usuario: 2,
        username: 'mlopez',
        nombres: 'María',
        apellidos: 'López',
        fecha_nacimiento: '1999-08-20',
        nombre_completo: 'María Lopez',
        grupos: ['user', 'admin'],
        activo: false
    }
]