import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PuntajeService } from '../../../../servicios/puntaje.service';
import { Subscription } from 'rxjs';

interface Carta {
  valor: number;
  imagen: string; // Ruta de la imagen de la carta
}

@Component({
  selector: 'app-mayor-menor',
  standalone: false,
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent {
  mazo: Carta[] = [];
  cartasRestantes:number | null = null;
  cartaActual: Carta | null = null;
  siguienteCarta: Carta | null = null;
  resultado: string = '';
  puntos: number = 0;
  imagenesCartas: string[] = [
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/Uno_de_Espadas.jpg?alt=media&token=e9c23499-e001-4132-8d1a-8ebbfb473a71",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/dos_de_Espadas.jpg?alt=media&token=addea70d-b3bd-4ced-b2e3-8fb14ca12760",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/tres_de_Espadas.jpg?alt=media&token=1dcbcebd-8776-484c-8eea-8382553a8aca",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/cuatro_de_Espadas.jpg?alt=media&token=a056812d-a1fe-4a4e-9ca6-43015a2ec1e7",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/cinco_De_Espadas.jpg?alt=media&token=ee4c27fd-b094-4cee-b03c-bae1cbd7ede0",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/seis_De_Espadas.jpg?alt=media&token=79d6cb9d-8f83-446f-b211-cce58b485f97",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/siete_De_Espadas.jpg?alt=media&token=d891815a-7ad6-47a5-8071-1efaea646672",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/ocho_De_Espadas.jpg?alt=media&token=5f9c2231-786d-44bb-8098-0e0a335101b8",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/nueve_de_Espadas.png?alt=media&token=0a959e68-2224-4949-8ccf-844e5f9c71af",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/diez_De_Espadas.jpg?alt=media&token=f3f62ed4-f943-4fa7-a5a7-13c7f7fec242",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/once_De_Espadas.jpg?alt=media&token=3c09dcb1-6062-41c6-ade2-6a4034f59bc9",
    "https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/doce_De_Espadas.jpg?alt=media&token=230a1927-b8e0-4423-a733-3699bdbee806"
  ];
  listar: boolean = false;
  suscripcion!: Subscription;
  puntajes: any[] = [];

  constructor(private router: Router, private puntuacion : PuntajeService) {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.mazo = this.generarMazo();
    this.cartaActual = this.mazo.pop() || null;
    this.siguienteCarta = this.mazo.pop() || null;
    this.resultado = '';
    this.puntos = 0;
    this.cartasRestantes = this.mazo.length+1;
  }

  listarPuntajes(){
    this.listar = !this.listar;
    this.suscripcion = this.puntuacion.obtenerPuntajes("MayorMenor").subscribe((respuesta: any) => {
      // Asignar directamente a mensajes en lugar de usar push
      this.puntajes = respuesta.map((item: { usuario: any; puntaje: any; fecha: any; juego:any; timestamp : any }) => ({
        usuario: item.usuario,
        fecha: item.fecha,
        puntaje: item.puntaje,
        juego: item.juego,
        timestamp: item.timestamp 
      }));
    });
  }
  generarMazo(): Carta[] {
    const mazo: Carta[] = [];
    for (let i = 1; i <= 12; i++) {
      mazo.push({ valor: i, imagen: this.imagenesCartas[i-1] }); // Ruta de las imágenes de las cartas
    }
    console.log(this.mezclar(mazo));
    return this.mezclar(mazo);
  }

  mezclar(array: Carta[]): Carta[] {
    for (let i = array.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  adivinar(opcion: string) {
    if ((opcion === 'mayor' && this.siguienteCarta!.valor > this.cartaActual!.valor) ||
        (opcion === 'menor' && this.siguienteCarta!.valor < this.cartaActual!.valor)) {
      this.resultado = '¡Correcto!';
      this.puntos++;
    } else {
      this.resultado = `¡Incorrecto! La carta correcta era ${this.siguienteCarta!.valor}`;
    }

    this.cartaActual = this.siguienteCarta;

    if (this.mazo.length > 0) {
      this.siguienteCarta = this.mazo.pop() || null;
      this.cartasRestantes = this.mazo.length+1;
    } else {
      this.resultado += ` Fin del juego. Puntos: ${this.puntos}`;
      this.siguienteCarta = null; // Termina el juego
      this.cartasRestantes = 0; // Deshabilita el botón de adivinar carta al final del juego
      this.puntuacion.guardarPuntaje(this.puntos,"MayorMenor");
    }
  }

  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
