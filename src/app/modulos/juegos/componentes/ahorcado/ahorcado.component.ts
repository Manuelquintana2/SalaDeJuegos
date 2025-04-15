import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PuntajeService } from '../../../../servicios/puntaje.service';
import { StorageService } from '../../../../servicios/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent implements OnDestroy, OnInit {
  private storageService = inject(StorageService);
  palabras: string[] = [
  'elefante',
  'montaña',
  'caramelo',
  'planeta',
  'mariposa',
  'murcielago',
  'biblioteca',
  'heladera',
  'ventilador',
  'camiseta',
  'jirafa',
  'cascada',
  'travesia',
  'avioneta',
  'sombrero',
  'galaxia',
  'tobogan',
  'cangrejo',
  'nube',
  'piruleta',
  'escalera',
  'fantasma',
  'volcan',
  'reloj',
  'alfombra',
  'espantapajaros',
  'cementerio',
  'jirafa',
  'circo',
  'luciérnaga'];
  puntaje: number = 0;
  palabraSeleccionada: string = '';
  letrasAdivinadas: string[] = [];
  intentosIncorrectos: number = 0;
  maxIntentosIncorrectos: number = 6;
  alfabeto: string[] = 'abcdefghijklmnñopqrstuvwxyz'.split('');
  imagenesArray: string[] = [];
  imagenActual!: string;
  listar: boolean = false;
  suscripcion!: Subscription;
  puntajes: any[] = [];

  constructor(private router: Router, private puntuacion: PuntajeService) {}

  async ngOnInit(): Promise<void> {
    await this.cargarImagenes();
    this.suscripcion = this.puntuacion.obtenerPuntajes("Ahorcado").subscribe((respuesta: any) => {
      this.puntajes = respuesta.map((item: any) => ({
        usuario: item.usuario,
        fecha: item.fecha,
        puntaje: item.puntaje,
        juego: item.juego,
        timestamp: item.timestamp
      }));
    });

    this.iniciarNuevoJuego();
  }

  async cargarImagenes() {
    try {
      const rutas = [
        'juegos/ahorcado/Ahorcado0.jpg',
        'juegos/ahorcado/Ahorcado1.jpg',
        'juegos/ahorcado/Ahorcado2.jpg',
        'juegos/ahorcado/Ahorcado3.jpg',
        'juegos/ahorcado/Ahorcado4.jpg',
        'juegos/ahorcado/Ahorcado5.jpg',
        'juegos/ahorcado/Ahorcado6.jpg',
        'juegos/ahorcado/AhorcadoWin.gif'
      ];
      this.imagenesArray = await Promise.all(rutas.map(ruta => this.storageService.obtenerImagen(ruta)));
    } catch (error) {
      console.error('Error al cargar imágenes del ahorcado:', error);
    }
  }

  iniciarNuevoJuego() {
    this.palabraSeleccionada = this.obtenerPalabraAleatoria();
    this.letrasAdivinadas = [];
    this.intentosIncorrectos = 0;
    this.imagenActual = this.imagenesArray[0];
    this.puntaje = 0;
  }

  listarPuntajes() {
    this.listar = !this.listar;
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
        if (this.puntaje > 0) this.puntaje--;
      } else {
        this.puntaje++;
      }
    }

    if (this.estaJuegoTerminado()) {
      this.puntuacion.guardarPuntaje(this.puntaje, "Ahorcado");
    }
  }

  estaJuegoTerminado(): boolean {
    if (this.estaPalabraAdivinada()) {
      this.imagenActual = this.imagenesArray[7];
    }
    return this.intentosIncorrectos >= this.maxIntentosIncorrectos || this.estaPalabraAdivinada();
  }

  estaPalabraAdivinada(): boolean {
    return this.palabraSeleccionada.split('').every(letra => this.letrasAdivinadas.includes(letra));
  }

  get mostrarPalabra(): string {
    return this.palabraSeleccionada.split('').map(letra => this.letrasAdivinadas.includes(letra) ? letra : '_').join(' ');
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
