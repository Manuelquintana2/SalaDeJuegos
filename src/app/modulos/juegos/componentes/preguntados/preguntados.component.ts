import { Component, OnDestroy, OnInit } from '@angular/core';
import { PreguntadosApiService } from '../../../../servicios/preguntados-api.service';
import { Subscription, timeout } from 'rxjs';
import { Router } from '@angular/router';


interface Personaje {
  nombre: string;
}

@Component({
  selector: 'app-preguntados',
  standalone: false,
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent implements OnInit, OnDestroy {

  suscripcion! : Subscription;
  personajes: any[] = [];
  listaDeUsados: any[] = [];
  personajeActual: any;
  siguientePersonaje: any;
  opciones!: string[];
  personajesRestantes! : number;
  resultado! : string;
  puntos: number = 0;

  constructor(private preguntadosService: PreguntadosApiService, private router: Router) {
  }

  ngOnInit(): void {
    this.suscripcion = this.preguntadosService.getRickAndMortyPJ().subscribe(data => {
      this.personajes = data;
      this.iniciarJuego();
    });
  }

  iniciarJuego(){
    this.personajes = this.mezclar(this.personajes);
    this.personajeActual = this.personajes.pop() || null;
    this.listaDeUsados.push(this.personajeActual);
    this.siguientePersonaje = this.personajes.pop() || null;
    this.opciones = this.obtenerOpcionesAleatorias(4);
    this.personajesRestantes = this.personajes.length+1;
  }

  mezclar(array: any[]): any[] {
    for (let i = array.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  obtenerOpcionesAleatorias(cantidad: number): string[] {
    console.log(this.personajeActual);
    let opcionesAleatorias: string[] = [];
    let listaOpcionesAleatorias: Personaje[] = [];
    listaOpcionesAleatorias = this.personajes.concat(this.listaDeUsados);
    // Asegúrate de que la cantidad no supere el número de héroes disponibles
    const cantidadReal = Math.min(cantidad, listaOpcionesAleatorias.length);
    if(this.personajes != null){
      while (opcionesAleatorias.length < cantidadReal) {
        const randomIndex = Math.floor(Math.random() * listaOpcionesAleatorias.length);
        const personaje = listaOpcionesAleatorias[randomIndex];
         // Agrega el héroe solo si no está ya en las opciones
         if (!opcionesAleatorias.includes(personaje.nombre)) {
          opcionesAleatorias.push(personaje.nombre);
        }
      }
      if(!opcionesAleatorias.includes(this.personajeActual)){
        opcionesAleatorias.push(this.personajeActual.nombre);
      }
      opcionesAleatorias = this.mezclar(opcionesAleatorias)
  
      return opcionesAleatorias;
    }
    return [];
  }

  seleccionarOpcion(opcion: string) {
    if (opcion === this.personajeActual.nombre) {
      console.log('Correcto!');
      this.puntos++;
    }
    else{
      console.log('Incorrecto!');
      if(this.puntos > 0){
        this.puntos--;
      }
    }
    
    this.personajeActual = this.siguientePersonaje;
    this.listaDeUsados.push(this.personajeActual);
    this.opciones = this.obtenerOpcionesAleatorias(4);
    console.log(this.personajes);

    if (this.personajes.length > 0) {
      this.siguientePersonaje = this.personajes.pop() || null;
      this.personajesRestantes = this.personajes.length+1;
    } else {
      this.siguientePersonaje = null; // Termina el juego
      this.personajesRestantes = 0; // Deshabilita el botón de adivinar carta al final del juego
    }
  }

  reiniciarjuego(){
    this.puntos = 0;
    this.ngOnInit();
  }
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
