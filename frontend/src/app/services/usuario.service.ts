import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { USUARIOS_INICIALES } from '../data/usuarios.data';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private usuarios: Usuario[] = [...USUARIOS_INICIALES];

    public getAll(): Usuario[] {
        return this.usuarios;
    }

    public getById(id_usuario: number): Usuario | undefined {
        return this.usuarios.find(usuario => usuario.id_usuario === id_usuario);
    }

    public create(usuario: Usuario): void{
        this.usuarios.push(usuario);
    }

    public delete(id_usuario: number): void {
        this.usuarios = this.usuarios.filter(usuario => usuario.id_usuario !== id_usuario)
    }

    public update(usuario: Usuario): void {
        const indice = this.usuarios.findIndex(u => u.id_usuario === usuario.id_usuario)

        if(indice !== -1){
            this.usuarios[indice] = usuario;
        }
    }
}