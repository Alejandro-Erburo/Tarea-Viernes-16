import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TareaService } from '../../services/tarea.service';
import { TareaCard } from '../../components/tarea/tarea.card';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tareas',
  imports: [RouterLink, TareaCard],
  templateUrl: './tareas.page.html'
})
export class TareasPage implements OnInit {
  
  private tareaService = inject(TareaService);

  public tareas = signal<Tarea[]>([]);

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.tareaService.getAll().subscribe({
      next: (tareas) => {
        this.tareas.set(tareas);
        console.log('Tareas cargadas:', tareas);
      },
      error: (error) => {
        console.error('Error al cargar tareas:', error);
      }
    });
  }

  eliminar(id: number): void {
    this.tareaService.delete(id).subscribe({
      next: () => {
        this.cargarTareas();
      },
      error: (error) => {
        console.error('Error al eliminar tarea:', error);
      }
    });
  }
}