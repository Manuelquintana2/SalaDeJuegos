import { Component, OnDestroy, OnInit } from '@angular/core';
import { PreguntadosApiService } from '../../../../servicios/preguntados-api.service';
import { Subscription, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { PuntajeService } from '../../../../servicios/puntaje.service';


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
  sub! : Subscription;
  personajes: any[] = [];
  listaDeUsados: any[] = [];
  personajeActual: any;
  siguientePersonaje: any;
  opciones!: string[];
  personajesRestantes! : number;
  resultado! : string;
  puntos: number = 0;
  puntajes: any[] = [];
  listar:boolean = false;

  constructor(private preguntadosService: PreguntadosApiService, private router: Router, private puntuacion : PuntajeService) {
  }

  ngOnInit(): void {
    this.sub = this.preguntadosService.getRickAndMortyPJ().subscribe(data => {
      this.personajes = data;
      this.iniciarJuego();
    });
  }

  listarPuntajes(){
    this.listar = !this.listar;
    this.suscripcion = this.puntuacion.obtenerPuntajes("Preguntados").subscribe((respuesta: any) => {
      this.puntajes = respuesta.map((item: { usuario: any; puntaje: any; fecha: any; juego:any; timestamp : any }) => ({
        usuario: item.usuario,
        fecha: item.fecha,
        puntaje: item.puntaje,
        juego: item.juego,
        timestamp: item.timestamp 
      }));
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
    if(this.personajeActual == null){
      this.puntuacion.guardarPuntaje(this.puntos,"Preguntados");
      return [];
    }

    console.log(this.personajeActual);
    let opcionesAleatorias: string[] = [];
    let listaOpcionesAleatorias: Personaje[] = [];
    listaOpcionesAleatorias = this.personajes.concat(this.listaDeUsados);
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
      this.puntos++;
    }
    else{
      if(this.puntos > 0){
        this.puntos--;
      }
    }
    
    this.personajeActual = this.siguientePersonaje;
    this.listaDeUsados.push(this.personajeActual);
    this.opciones = this.obtenerOpcionesAleatorias(4);

    if (this.personajes.length > 0) {
      this.siguientePersonaje = this.personajes.pop() || null;
      this.personajesRestantes = this.personajes.length+1;
    }else {
      this.siguientePersonaje = null; // Termina el juego
      this.personajesRestantes = 0; // Deshabilita el botón de adivinar carta al final del juego
    }
  }

  reiniciarjuego(){
    this.puntos = 0;
    this.personajes = this.listaDeUsados.filter(el => el !== null);
    this.listaDeUsados = [];
    this.iniciarJuego();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if(this.suscripcion != null){
      this.suscripcion.unsubscribe();
    }
  }
  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
