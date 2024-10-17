import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PuntajeService } from '../../../../servicios/puntaje.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrl: './tetris.component.css'
})
export class TetrisComponent implements OnInit{
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private contexto!: CanvasRenderingContext2D;
  private TAMAÑO_BLOQUE = 20;
  private ANCHO_TABLERO = 14;
  private ALTO_TABLERO = 30;


  juegoTerminado!: boolean;

  contadorGuardado : number = 0;

  puntaje = 0;
  private contadorCaida = 0;
  private ultimaTiempo = 0;
  private tablero: number[][] = this.crearTablero(this.ANCHO_TABLERO, this.ALTO_TABLERO);

  private pieza = {
  posicion: { x: 5, y: 5 },
  forma: [
    [1, 1],
    [1, 1]
  ],
  };

  private PIEZAS: number[][][] = [
  [[1, 1], [1, 1]],
  [[1, 1, 1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[1, 0], [1, 0], [1, 1]]
  ];
  listar: boolean = false;
  suscripcion!: Subscription;
  puntajes: any[] = [];

  constructor(private router: Router, private puntuacion : PuntajeService){
    this.juegoTerminado = false;
  }
  ngOnInit() {
    this.establecerValores();
  }

  establecerValores(){
    const canvas = this.canvasRef.nativeElement;
    this.contexto = canvas.getContext("2d")!;
    canvas.width = this.TAMAÑO_BLOQUE * this.ANCHO_TABLERO;
    canvas.height = this.TAMAÑO_BLOQUE * this.ALTO_TABLERO;
    this.contexto.scale(this.TAMAÑO_BLOQUE, this.TAMAÑO_BLOQUE);
    document.addEventListener("keydown", this.manejarTeclaPresionada.bind(this));
    this.iniciarJuego();
  }
  listarPuntajes(){
    this.listar = !this.listar;
    this.suscripcion = this.puntuacion.obtenerPuntajes("Tetris").subscribe((respuesta: any) => {
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
  private crearTablero(ancho: number, alto: number): number[][] {
    return Array(alto).fill(0).map(() => Array(ancho).fill(0));
  }

  private iniciarJuego() {
      this.actualizar();  
  }

  private actualizar(tiempo: number = 0) {
    const deltaTiempo = tiempo - this.ultimaTiempo;
    this.ultimaTiempo = tiempo;
    this.contadorCaida += deltaTiempo;

    if (this.contadorCaida > 500) {
      this.pieza.posicion.y++;
      this.contadorCaida = 0;

      if (this.verificarColision()) {
        this.pieza.posicion.y--;
        this.solidificarPieza();
        this.eliminarFilas();
      }
    }
    if(this.juegoTerminado == false){
      this.dibujar();
    }
    window.requestAnimationFrame(this.actualizar.bind(this));
  }

  private dibujar() {
    this.contexto.fillStyle = "#000";
    this.contexto.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.tablero.forEach((fila, y) => {
      fila.forEach((valor, x) => {
        if (valor === 1) {
          this.contexto.fillStyle = "yellow";
          this.contexto.fillRect(x, y, 1, 1);
        }
      });
    });

    this.pieza.forma.forEach((fila, y) => {
      fila.forEach((valor, x) => {
        if (valor === 1) {
          this.contexto.fillStyle = "red";
          this.contexto.fillRect(x + this.pieza.posicion.x, y + this.pieza.posicion.y, 1, 1);
        }
      });
    });
  }

  private verificarColision(): boolean {
    return this.pieza.forma.some((fila, y) => {
      return fila.some((valor, x) => {
        return (
          valor !== 0 &&
          (this.tablero[y + this.pieza.posicion.y]?.[x + this.pieza.posicion.x] !== 0)
        );
      });
    });
  }

  private solidificarPieza() {
    this.pieza.forma.forEach((fila, y) => {
      fila.forEach((valor, x) => {
        if (valor === 1) {
          this.tablero[y + this.pieza.posicion.y][x + this.pieza.posicion.x] = 1;
        }
      });
    });

    // Reiniciar posición
    this.pieza.posicion.x = Math.floor(this.ANCHO_TABLERO / 2 - 2);
    this.pieza.posicion.y = 0;

    // Obtener forma aleatoria
    this.pieza.forma = this.PIEZAS[Math.floor(Math.random() * this.PIEZAS.length)];

    // Fin del juego
    if (this.verificarColision() && this.contadorGuardado == 0) {
      this.contadorGuardado += 1;
      this.juegoTerminado = true;
      this.puntuacion.guardarPuntaje(this.puntaje,"Tetris");
    }
  }

  private eliminarFilas() {
    const filasAEliminar: number[] = [];

    this.tablero.forEach((fila, y) => {
      if (fila.every(valor => valor === 1)) {
        filasAEliminar.push(y);
      }
    });

    filasAEliminar.forEach(y => {
      this.tablero.splice(y, 1);
      this.tablero.unshift(Array(this.ANCHO_TABLERO).fill(0));
      this.puntaje += 1;
    });
  }

  // Manejador de eventos para las teclas
  manejarTeclaPresionada(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      this.pieza.posicion.x--;
      if (this.verificarColision()) {
        this.pieza.posicion.x++;
      }
    }
    if (event.key === "ArrowRight") {
      this.pieza.posicion.x++;
      if (this.verificarColision()) {
        this.pieza.posicion.x--;
      }
    }
    if (event.key === "ArrowDown") {
      this.pieza.posicion.y++;
      if (this.verificarColision()) {
        this.pieza.posicion.y--;
        this.solidificarPieza();
        this.eliminarFilas();
      }
    }
    if (event.key === "ArrowUp") {
      const rotado: number[][] = [];
      for (let i = 0; i < this.pieza.forma[0].length; i++) {
        const fila: number[] = [];
        for (let j = this.pieza.forma.length - 1; j >= 0; j--) {
          fila.push(this.pieza.forma[j][i]);
        }
        rotado.push(fila);
      }
      const formaAnterior = this.pieza.forma;
      this.pieza.forma = rotado;
      if (this.verificarColision()) {
        this.pieza.forma = formaAnterior;
      }
    }
  }

  reiniciar(){
    this.juegoTerminado = false;
    this.puntaje = 0;
    this.contadorGuardado = 0;
    this.tablero.forEach((fila)=> fila.fill(0));
  }
  volverAlHome(){
    this.router.navigate(['/home']);
  }
}


