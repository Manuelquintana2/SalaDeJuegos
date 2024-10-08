import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './componentes/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './componentes/preguntados/preguntados.component';

@NgModule({
  declarations: [AhorcadoComponent,MayorMenorComponent,PreguntadosComponent],
  exports: [AhorcadoComponent, MayorMenorComponent, PreguntadosComponent],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule { }
