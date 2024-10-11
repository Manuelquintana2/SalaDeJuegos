import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from './componentes/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './componentes/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './componentes/preguntados/preguntados.component';
import { TetrisComponent } from './componentes/tetris/tetris.component';

@NgModule({
  declarations: [AhorcadoComponent,MayorMenorComponent,PreguntadosComponent, TetrisComponent],
  exports: [AhorcadoComponent, MayorMenorComponent, PreguntadosComponent, TetrisComponent],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ]
})
export class JuegosModule { }
