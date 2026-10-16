export interface Tarea {
    id_tarea: number;
    id_creador: number;
    grupo: string;
    titulo: string;
    descripcion: string;
    prioridad: '0:baja' | '1:media' | '2:alta';
    creada: string;
    terminada: string | null;
    estado: string;
}
