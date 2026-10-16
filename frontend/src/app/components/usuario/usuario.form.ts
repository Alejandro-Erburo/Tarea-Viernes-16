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
  public usuario = signal<Usuario | undefined>(undefined);
  public error = '';
  public guardando = false;

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
      this.usuarioService.getById(Number(this.idUsuario)).subscribe({
        next: (usuario) => {
          this.usuario.set(usuario);

          this.datosFormulario.set({
            username: usuario.username,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            fecha_nacimiento: usuario.fecha_nacimiento.substring(0, 10),
            grupos: [...usuario.grupos],
            activo: usuario.activo
          });
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
          this.error = 'No se pudo cargar el usuario.';
        }
      });
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

    if (this.guardando) {
      return;
    }

    this.error = '';
    this.guardando = true;

    const datosUsuario = {
      username: datos.username.trim(),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      fecha_nacimiento: datos.fecha_nacimiento,
      grupos: datos.grupos,
      activo: datos.activo
    };
    
    const peticion = this.esEdicion
      ? this.usuarioService.update({
          ...datosUsuario,
          id_usuario: Number(this.idUsuario),
          nombre_completo: this.usuario()?.nombre_completo ?? ''
        })
      : this.usuarioService.create({
          ...datosUsuario,
          id_usuario: 0,
          nombre_completo: ''
        });

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/usuarios']);
      },
      error: (error) => {
        console.error('Error al guardar usuario:', error);
        this.error = error.error?.message ??
          'No se pudo guardar el usuario.';
        this.guardando = false;
      }
    });
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