import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent {
  palabras: string[] = ['angular', 'typescript', 'componente', 'servicio', 'directiva'];
  palabraSeleccionada: string = '';
  letrasAdivinadas: string[] = [];
  intentosIncorrectos: number = 0;
  maxIntentosIncorrectos: number = 6;
  alfabeto: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
  imagenesArray : string[] = [
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/palo.jpg?alt=media&token=c587dd05-921e-4851-8294-a66e6f6592a1',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/1.jpg?alt=media&token=efba3e64-dbec-49bd-90d9-de15b3e4bc55', 
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/2.jpg?alt=media&token=c5997dd2-b567-4761-a5f8-0f8456edbc11',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/3.jpg?alt=media&token=03db83d4-2341-4337-b61b-a766faf82645',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/4.jpg?alt=media&token=81e18765-680e-4c1d-897f-abc1a8b27c70',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/5.jpg?alt=media&token=23d6926a-3153-4f4b-a76e-72b8e7043f63',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/6.jpg?alt=media&token=6bce9077-54c5-4f9c-97c7-30daa93bb125',
    'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/win.gif?alt=media&token=1e89fdcc-0e11-4e3d-94f2-a965b0efc64b'
];
imagenActual!:string; 

  constructor(private router:Router) {
    this.iniciarNuevoJuego();
  }

  iniciarNuevoJuego() {
    this.palabraSeleccionada = this.obtenerPalabraAleatoria();
    this.letrasAdivinadas = [];
    this.intentosIncorrectos = 0;
    this.imagenActual = this.imagenesArray[0];
  }

  obtenerPalabraAleatoria(): string {
    return this.palabras[Math.floor(Math.random() * this.palabras.length)];
  }

  adivinarLetra(letra: string) {
    if (!this.letrasAdivinadas.includes(letra) && this.intentosIncorrectos < this.maxIntentosIncorrectos) {
      this.letrasAdivinadas.push(letra);
      if (!this.palabraSeleccionada.includes(letra)) {
        this.intentosIncorrectos++;
        this.imagenActual = this.imagenesArray[this.intentosIncorrectos];
      }
    }
  }
  estaJuegoTerminado(): boolean {
    if(this.estaPalabraAdivinada())
      this.imagenActual = this.imagenesArray[7];
    return this.intentosIncorrectos >= this.maxIntentosIncorrectos || this.estaPalabraAdivinada();
  }

  estaPalabraAdivinada(): boolean {
    return this.palabraSeleccionada.split('').every(letra => this.letrasAdivinadas.includes(letra));
  }

  get mostrarPalabra(): string {
    return this.palabraSeleccionada.split('').map(letra => this.letrasAdivinadas.includes(letra) ? letra : '_').join(' ');
  }

  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
