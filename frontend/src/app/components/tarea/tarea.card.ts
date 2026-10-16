import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tarea } from '../../models/tarea.model';
import { form, FormField } from '@angular/forms/signals';
import { signal, effect } from '@angular/core';

@Component({
  selector: 'app-tarea-card',
  imports: [RouterLink, FormField],
  templateUrl: './tarea.card.html'
})
export class TareaCard {
    tarea = input<Tarea | null>(null);
    modoFormulario = input(false);
  
    eliminar = output<number>();
    guardar = output<Tarea>();
    error = '';

    datos = signal({
    id_creador: 1,
    grupo: 'user',
    titulo: '',
    descripcion: '',
    prioridad: '1:media' as Tarea['prioridad'],
    estado: 'pendiente'
    });

    tareaForm = form(this.datos);

    constructor() {
        effect(() => {
        const tarea = this.tarea();

        if (tarea && this.modoFormulario()) {
            this.datos.set({
                id_creador: tarea.id_creador,
                grupo: tarea.grupo,
                titulo: tarea.titulo,
                descripcion: tarea.descripcion,
                prioridad: tarea.prioridad,
                estado: tarea.estado
            });
        }
        });
    }

    cambiarGrupo(grupo: string): void {
        this.datos.update(d => ({ ...d, grupo }));
    }

    cambiarPrioridad(prioridad: Tarea['prioridad']): void {
        this.datos.update(d => ({ ...d, prioridad }));
    }

        cambiarEstado(estado: string): void {
        this.datos.update(d => ({ ...d, estado }));
    }

    guardarFormulario(): void {
        const datos = this.datos();

        if (!datos.titulo.trim() || !datos.descripcion.trim()) {
            this.error = 'Completá el título y la descripción.';
            return;
        }

        if (datos.id_creador <= 0) {
            this.error = 'El ID del creador debe ser positivo.';
            return;
        }

        const original = this.tarea();

        this.guardar.emit(
        {
            id_tarea: original?.id_tarea ?? 0,
            id_creador: datos.id_creador,
            grupo: datos.grupo,
            titulo: datos.titulo.trim(),
            descripcion: datos.descripcion.trim(),
            prioridad: datos.prioridad,
            estado: datos.estado,
            creada: original?.creada ?? new Date().toISOString(),
            terminada: datos.estado === 'finalizada'
                ? (original?.terminada ?? new Date().toISOString())
                : null
        });
    }
}