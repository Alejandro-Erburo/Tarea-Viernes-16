import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';

import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../models/tarea.model';
import { TareaCard } from './tarea.card';

@Component({
  selector: 'app-tarea-form',
  imports: [TareaCard, RouterLink],
  template: `
    @if (!esEdicion || tarea) {
      <app-tarea-card
        [tarea]="tarea"
        [modoFormulario]="true"
        (guardar)="guardar($event)"
      />
    } @else {
      <p>Tarea no encontrada.</p>
      <a routerLink="/tareas">Volver</a>
    }
  `
})
export class TareaForm {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tareaService = inject(TareaService);

    public idTarea = this.route.snapshot.paramMap.get('id_tarea');
    public esEdicion = this.idTarea !== null;
    
    tarea: Tarea | null = this.esEdicion
    ? this.tareaService.getById(Number(this.idTarea)) ?? null
    : null;

    guardar(tarea: Tarea): void {
        if (this.esEdicion) {
        this.tareaService.update(tarea);
        } else {
        const tareas = this.tareaService.getAll();

        const nuevoId =
            Math.max(0, ...tareas.map(t => t.id_tarea)) + 1;

        this.tareaService.create({
            ...tarea,
            id_tarea: nuevoId
        });
        }

        this.router.navigate(['/tareas']);
    }
}