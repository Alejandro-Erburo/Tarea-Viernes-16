import { Injectable } from '@angular/core';
import { Tarea } from '../models/tarea.model';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private tareas: Tarea[] = [
    {
      id_tarea: 1,
      id_creador: 1,
      grupo: 'user',
      titulo: 'Estudiar Angular',
      descripcion: 'Practicar componentes y servicios',
      prioridad: '2:alta',
      creada: '2026-10-16',
      terminada: null,
      estado: 'pendiente'
    },
    {
      id_tarea: 2,
      id_creador: 2,
      grupo: 'admin',
      titulo: 'Preparar documentación',
      descripcion: 'Revisar las rutas de la API',
      prioridad: '1:media',
      creada: '2026-10-16',
      terminada: null,
      estado: 'pendiente'
    }
  ];

  getAll(): Tarea[] {
    return this.tareas;
  }

  getById(id: number): Tarea | undefined {
    return this.tareas.find(t => t.id_tarea === id);
  }

  create(tarea: Tarea): void {
    this.tareas.push(tarea);
  }

  update(tarea: Tarea): void {
    const indice = this.tareas.findIndex(
      t => t.id_tarea === tarea.id_tarea
    );

    if (indice !== -1) {
      this.tareas[indice] = tarea;
    }
  }

  delete(id: number): void {
    this.tareas = this.tareas.filter(t => t.id_tarea !== id);
  }
}