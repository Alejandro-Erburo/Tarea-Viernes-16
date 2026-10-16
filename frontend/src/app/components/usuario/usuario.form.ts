import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { form, FormField } from '@angular/forms/signals'

@Component({
  imports: [FormField, RouterLink],
  selector: 'app-usuario',
  styleUrl: './usuario.form.css',
  templateUrl: './usuario.form.html',
})

export class UsuarioForm implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  public idUsuario = this.route.snapshot.paramMap.get('id_usuario');
  public esEdicion = this.idUsuario !== null;
  public usuario: Usuario | undefined;
  public error = '';

  public datosFormulario = signal({
    username:'',
    nombres:'',
    apellidos:'',
    fecha_nacimiento:'',
    grupos: ['user'],
    activo: true
  })

  public usuarioForm = form(this.datosFormulario);

  public ngOnInit(): void {
    if(this.esEdicion){
      this.usuario = this.usuarioService.getById(Number(this.idUsuario));
      //console.log('Usuario encontrado:', this.usuario);
      if(this.usuario){
        this.datosFormulario.set({
          username: this.usuario.username,
          nombres: this.usuario.nombres,
          apellidos: this.usuario.apellidos,
          fecha_nacimiento: this.usuario.fecha_nacimiento,
          grupos: [...this.usuario.grupos],
          activo: this.usuario.activo
        });
      } else {
        this.error = 'Usuario no encontrado'; 
      }
    }
  }

  guardar(): void {
    const datos = this.datosFormulario();

    if (
      !datos.username.trim() ||
      !datos.nombres.trim() ||
      !datos.apellidos.trim() ||
      !datos.fecha_nacimiento ||
      datos.grupos.length === 0
    ) {
      this.error = 'Completá todos los campos obligatorios.';
      return;
    }

    const usuario: Usuario = {
      id_usuario: this.usuario?.id_usuario ?? this.generarId(),
      username: datos.username.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      fecha_nacimiento: datos.fecha_nacimiento,
      nombre_completo: `${datos.nombres.trim()} ${datos.apellidos.trim()}`,
      grupos: datos.grupos,
      activo: datos.activo
    };

    if (this.esEdicion) {
      this.usuarioService.update(usuario);
    } else {
      this.usuarioService.create(usuario);
    }

    this.router.navigate(['/usuarios']);
  }

  private generarId(): number {
    const usuarios = this.usuarioService.getAll();

    return Math.max(0, ...usuarios.map(u => u.id_usuario)) + 1;
  }

  cambiarGrupo(grupo: string): void {
    this.datosFormulario.update(datos => {
      const grupos = datos.grupos.includes(grupo)
        ? datos.grupos.filter(g => g !== grupo)
        : [...datos.grupos, grupo];

      return { ...datos, grupos };
    });
  }

  cambiarActivo(activo: boolean): void {
    this.datosFormulario.update(datos => ({
      ...datos,
      activo
    }));
  }
}