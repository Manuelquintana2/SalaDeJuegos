import { Component, OnDestroy, OnInit } from '@angular/core';
import { PreguntadosApiService } from '../../../../servicios/preguntados-api.service';
import { Subscription, timeout } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent implements OnInit, OnDestroy {

  heroes: any[] = [];
  suscripcion! : Subscription;
  heroeActual: any;
  siguienteHeroe: any;
  opciones!: string[];
  heroesRestantes! : number;
  resultado! : string;
  puntos: number = 0;

  constructor(private preguntadosService: PreguntadosApiService, private router: Router) {
  }

  ngOnInit(): void {
    this.suscripcion = this.preguntadosService.getHeroes().subscribe(data => {
    this.heroes = data;
    this.iniciarJuego();  
    console.log(this.heroes);
    });;
  }

  iniciarJuego(){
    if (this.heroes.length === 0) {
      console.error('No hay héroes disponibles.');
      return;
    }
    this.heroes = this.mezclar(this.heroes);
    this.heroeActual = this.heroes.pop() || null;
    console.log(this.heroeActual);
    this.siguienteHeroe = this.heroes.pop() || null;
    this.opciones = this.obtenerOpcionesAleatorias(4);
    console.log('Opciones:', this.opciones);
    this.heroesRestantes = this.heroes.length+1;
  }

  mezclar(array: any[]): any[] {
    for (let i = array.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  obtenerOpcionesAleatorias(cantidad: number): string[] {
    let opcionesAleatorias: string[] = [];
    
    // Asegúrate de que la cantidad no supere el número de héroes disponibles
    const cantidadReal = Math.min(cantidad, this.heroes.length);
    
    while (opcionesAleatorias.length < cantidadReal) {
      const randomIndex = Math.floor(Math.random() * this.heroes.length);
      const heroe = this.heroes[randomIndex];
       // Agrega el héroe solo si no está ya en las opciones
       if (!opcionesAleatorias.includes(heroe.nombre)) {
        opcionesAleatorias.push(heroe.nombre);
      }
    }
    if(!opcionesAleatorias.includes(this.heroeActual)){
      opcionesAleatorias.push(this.heroeActual.nombre);
    }
    opcionesAleatorias = this.mezclar(opcionesAleatorias)

    return opcionesAleatorias;
  }

  seleccionarOpcion(opcion: string) {
    console.log('Opción seleccionada:', opcion);
    if (opcion === this.heroeActual.nombre) {
      console.log('Correcto!');
      this.puntos++;
    }
    else{
      console.log('Incorrecto!');
      if(this.puntos>0){
        this.puntos--;
      }
    }
    this.heroeActual = this.siguienteHeroe;
    console.log(this.heroeActual);
    this.opciones = this.obtenerOpcionesAleatorias(4);
    console.log(this.opciones);

    if (this.heroes.length > 0) {
      this.siguienteHeroe = this.heroes.pop() || null;
      this.heroesRestantes = this.heroes.length+1;
    } else {
      this.resultado = `Fin del juego`;
      this.siguienteHeroe = null; // Termina el juego
      this.heroesRestantes = 0; // Deshabilita el botón de adivinar carta al final del juego
    }
  }
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
