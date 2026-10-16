import { Routes } from '@angular/router';
import { UsuariosPage } from './pages/usuarios/usuarios.page'
import { UsuarioForm } from './components/usuario/usuario.form';
import { TareasPage } from './pages/tareas/tareas.page';
import { TareaForm } from './components/tarea/tarea.form';

export const routes: Routes = [
    {
        path: '', redirectTo: 'usuarios', pathMatch: 'full'
    },
    {
        path: 'usuarios',
        component: UsuariosPage
    },
    {
        path: 'usuarios/crear',
        component: UsuarioForm
    },
    {
        path: 'usuarios/:id_usuario',
        component: UsuarioForm
    },
    {
        path: 'tareas',
        component: TareasPage
    },
    {
        path: 'tareas/crear',
        component: TareaForm
    },
    {
        path: 'tareas/:id_tarea',
        component: TareaForm
    }
];
