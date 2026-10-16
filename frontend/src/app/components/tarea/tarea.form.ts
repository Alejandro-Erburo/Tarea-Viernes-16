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
    @if (!esEdicion || tarea()) {
      <app-tarea-card
        [tarea]="tarea()"
        [modoFormulario]="true"
        (guardar)="guardar($event)"
      />
    } @else if (cargando()) {
      <p>Cargando tarea...</p>
    } @else {
      <p>{{ error() || 'Tarea no encontrada.' }}</p>
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
    
    public tarea = signal<Tarea | null>(null);
    public cargando = signal(false);
    public error = signal('');

    ngOnInit(): void {
      if (this.esEdicion) {
        this.cargando.set(true);

        this.tareaService.getById(Number(this.idTarea)).subscribe({
          next: (tarea) => {
            this.tarea.set(tarea);
            this.cargando.set(false);
          },
          error: (error) => {
            console.error('Error al cargar tarea:', error);
            this.error.set('No se pudo cargar la tarea.');
            this.cargando.set(false);
          }
        });
      }
    }

    guardar(tarea: Tarea): void {
      this.error.set('');

      if (this.esEdicion) {
        this.tareaService.update(tarea).subscribe({
          next: () => {
            this.router.navigate(['/tareas']);
          },
          error: (error: unknown) => {
            console.error('Error al actualizar tarea:', error);
            this.error.set('No se pudo actualizar la tarea.');
          }
        });
      } else {
        this.tareaService.create(tarea).subscribe({
          next: () => {
            this.router.navigate(['/tareas']);
          },
          error: (error: unknown) => {
            console.error('Error al crear tarea:', error);
            this.error.set('No se pudo crear la tarea.');
          }
        });
      }
    }
}