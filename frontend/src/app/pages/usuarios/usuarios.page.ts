import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-usuarios',
  styleUrl: './usuarios.page.css',
  templateUrl: './usuarios.page.html',
})
export class UsuariosPage implements OnInit {

  private usuarioService = inject(UsuarioService);
  public usuarios = signal<Usuario[]>([]);
  
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  public cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        console.log('Usuarios cargados:', usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  public eliminar(id_usuario: number): void{
    this.usuarioService.delete(id_usuario).subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    });
  }
}
