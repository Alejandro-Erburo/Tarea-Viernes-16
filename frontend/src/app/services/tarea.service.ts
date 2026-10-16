import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../models/tarea.model';

type DatosTarea = Omit<Tarea, 'id_tarea' | 'creada' | 'estado'>;

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:3000/tareas';

  public getAll(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  public getById(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  public create(tarea: Tarea): Observable<Tarea> {
    const datos: DatosTarea = {
      id_creador: tarea.id_creador,
      grupo: tarea.grupo,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      terminada: tarea.terminada
    };
    return this.http.post<Tarea>(this.apiUrl, datos);
  }

  public update(tarea: Tarea): Observable<void> {
    const datos: DatosTarea = {
      id_creador: tarea.id_creador,
      grupo: tarea.grupo,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      terminada: tarea.terminada
    };

    return this.http.patch<void>(
      `${this.apiUrl}/${tarea.id_tarea}`,
      datos
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}