import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-usuarios',
  styleUrl: './usuarios.page.css',
  templateUrl: './usuarios.page.html',
})
export class UsuariosPage {

  private usuarioService = inject(UsuarioService);
  public usuarios: Usuario[] = this.usuarioService.getAll();
  
  public eliminar(id_usuario: number): void{
    this.usuarioService.delete(id_usuario);
    this.usuarios = this.usuarioService.getAll();
  }

}
