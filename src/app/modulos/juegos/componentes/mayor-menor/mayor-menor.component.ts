import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PuntajeService } from '../../../../servicios/puntaje.service';
import { Subscription } from 'rxjs';
import { StorageService } from '../../../../servicios/storage.service';

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
export class MayorMenorComponent implements OnDestroy, OnInit {
  private storageService = inject(StorageService);

  mazo: Carta[] = [];
  cartasRestantes: number | null = null;
  cartaActual: Carta | null = null;
  siguienteCarta: Carta | null = null;
  resultado: string = '';
  puntos: number = 0;
  imagenesCartas: string[] = [];
  listar: boolean = false;
  suscripcion!: Subscription;
  puntajes: any[] = [];

  constructor(private router: Router, private puntuacion: PuntajeService) {}

  async ngOnInit(): Promise<void> {
    await this.cargarImagenesCartas();
    this.iniciarJuego();

    this.suscripcion = this.puntuacion.obtenerPuntajes("MayorMenor").subscribe((respuesta: any) => {
      this.puntajes = respuesta.map((item: { usuario: any; puntaje: any; fecha: any; juego: any; timestamp: any }) => ({
        usuario: item.usuario,
        fecha: item.fecha,
        puntaje: item.puntaje,
        juego: item.juego,
        timestamp: item.timestamp
      }));
    });
  }

  async cargarImagenesCartas() {
    try {
      const rutas = Array.from({ length: 12 }, (_, i) => `juegos/mayorMenorJuego/Espada${i+1}.jpg`);
      this.imagenesCartas = await Promise.all(rutas.map(ruta => this.storageService.obtenerImagen(ruta)));
    } catch (error) {
      console.error('Error al cargar imágenes de cartas:', error);
    }
  }

  iniciarJuego() {
    this.mazo = this.generarMazo();
    this.cartaActual = this.mazo.pop() || null;
    this.siguienteCarta = this.mazo.pop() || null;
    this.resultado = '';
    this.puntos = 0;
    this.cartasRestantes = this.mazo.length + 1;
  }

  listarPuntajes() {
    this.listar = !this.listar;
  }

  generarMazo(): Carta[] {
    const mazo: Carta[] = [];
    for (let i = 1; i <= 12; i++) {
      mazo.push({ valor: i, imagen: this.imagenesCartas[i - 1] });
    }
    return this.mezclar(mazo);
  }

  mezclar(array: Carta[]): Carta[] {
    for (let i = array.length - 1; i > 0; i--) {
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
      this.cartasRestantes = this.mazo.length + 1;
    } else {
      this.resultado += ` Fin del juego. Puntos: ${this.puntos}`;
      this.siguienteCarta = null;
      this.cartasRestantes = 0;
      this.puntuacion.guardarPuntaje(this.puntos, "MayorMenor");
    }
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
