import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { QuienSoyComponent } from './componentes/quien-soy/quien-soy.component';
import { PageNotFoundComponent } from './componentes/page-not-found/page-not-found.component';
import { RegisterComponent } from './componentes/register/register.component';
import { guardDeJuegosGuard } from './guards/guard-de-juegos.guard';
import { EncuestaComponent } from './componentes/encuesta/encuesta.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'quien-soy', component: QuienSoyComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'encuesta', component: EncuestaComponent },
    { path: 'juegos',
        loadChildren:()=> import('./modulos/juegos/juegos.module').then(m=>m.JuegosModule),
        canActivate: [guardDeJuegosGuard]
    },
    { path: '**', component: PageNotFoundComponent }
];

