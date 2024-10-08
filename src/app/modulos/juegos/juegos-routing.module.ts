import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './componentes/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './componentes/preguntados/preguntados.component';

const routes: Routes = [
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayorMenor', component: MayorMenorComponent },
  { path: 'preguntados', component: PreguntadosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
