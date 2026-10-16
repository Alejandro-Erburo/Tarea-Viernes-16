export interface Usuario {
    id_usuario: number;
    username: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    nombre_completo: string;
    grupos: string[];
    activo: boolean;
}