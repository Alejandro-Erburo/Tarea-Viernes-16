import { Injectable, inject } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { USUARIOS_INICIALES } from '../data/usuarios.data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private http = inject(HttpClient);
    private apiUrl = 'http://127.0.0.1:3000/usuarios';

    public getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(this.apiUrl);
    }

    public getById(id_usuario: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/${id_usuario}`);
    }

    public create(usuario: Usuario): Observable<Usuario>{
       return this.http.post<Usuario>(this.apiUrl, usuario);
    }

    public delete(id_usuario: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id_usuario}`);
    }

    public update(usuario: Usuario): Observable<Usuario> {
        const {
            id_usuario,
            nombre_completo,
            ...datosActualizados
        } = usuario;
        return this.http.patch<Usuario>(
            `${this.apiUrl}/${id_usuario}`,
            datosActualizados
        );
    }
}