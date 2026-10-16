import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TareaService } from '../../services/tarea.service';
import { TareaCard } from '../../components/tarea/tarea.card';
import { Tarea } from '../../models/tarea.model';

@Component({
  selector: 'app-tareas',
  imports: [RouterLink, TareaCard],
  templateUrl: './tareas.page.html'
})
export class TareasPage {
  private tareaService = inject(TareaService);

  public tareas: Tarea[] = this.tareaService.getAll();

  eliminar(id: number): void {
    this.tareaService.delete(id);
    this.tareas = this.tareaService.getAll();
  }
}