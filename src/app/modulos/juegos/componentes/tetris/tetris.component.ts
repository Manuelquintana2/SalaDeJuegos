import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrl: './tetris.component.css'
})
export class TetrisComponent implements OnInit{
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D;
  private BLOCK_SIZE = 20;
  private BOARD_WIDTH = 14;
  private BOARD_HEIGHT = 30;

  gameOver! :boolean;

  score = 0;
  private dropCounter = 0;
  private lastTime = 0;
  private board: number[][] = this.createBoard(this.BOARD_WIDTH, this.BOARD_HEIGHT);
  
  private piece = {
    position: { x: 5, y: 5 },
    shape: [
      [1, 1],
      [1, 1]
    ],
  };

  private PIECES: number[][][] = [
    [[1, 1], [1, 1]],
    [[1, 1, 1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[1, 0], [1, 0], [1, 1]]
  ];

  constructor(private router: Router){
    this.gameOver = false;
  }
  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego(){
    const canvas = this.canvasRef.nativeElement;
    this.context = canvas.getContext("2d")!;
    canvas.width = this.BLOCK_SIZE * this.BOARD_WIDTH;
    canvas.height = this.BLOCK_SIZE * this.BOARD_HEIGHT;
    this.context.scale(this.BLOCK_SIZE, this.BLOCK_SIZE);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.startGame();
  }
  private createBoard(width: number, height: number): number[][] {
    return Array(height).fill(0).map(() => Array(width).fill(0));
  }

  private startGame() {
      this.update();  
  }

  private update(time: number = 0) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > 500) {
      this.piece.position.y++;
      this.dropCounter = 0;

      if (this.checkCollision()) {
        this.piece.position.y--;
        this.solidifyPiece();
        this.removeRows();
      }
    }
    if(this.gameOver == false){
      this.draw();
    }
    window.requestAnimationFrame(this.update.bind(this));
  }

  private draw() {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.context.fillStyle = "yellow";
          this.context.fillRect(x, y, 1, 1);
        }
      });
    });

    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.context.fillStyle = "red";
          this.context.fillRect(x + this.piece.position.x, y + this.piece.position.y, 1, 1);
        }
      });
    });
  }

  private checkCollision(): boolean {
    return this.piece.shape.some((row, y) => {
      return row.some((value, x) => {
        return (
          value !== 0 &&
          (this.board[y + this.piece.position.y]?.[x + this.piece.position.x] !== 0)
        );
      });
    });
  }

  private solidifyPiece() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.board[y + this.piece.position.y][x + this.piece.position.x] = 1;
        }
      });
    });

    // Reiniciar posición
    this.piece.position.x = Math.floor(this.BOARD_WIDTH / 2 - 2);
    this.piece.position.y = 0;

    // Obtener forma aleatoria
    this.piece.shape = this.PIECES[Math.floor(Math.random() * this.PIECES.length)];

    // Fin del juego
    if (this.checkCollision()) {
      this.gameOver = true;
    }
  }

  private removeRows() {
    const rowsToRemove: number[] = [];

    this.board.forEach((row, y) => {
      if (row.every(value => value === 1)) {
        rowsToRemove.push(y);
      }
    });

    rowsToRemove.forEach(y => {
      this.board.splice(y, 1);
      this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
      this.score += 1;
    });
  }

  // Manejador de eventos para las teclas
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      this.piece.position.x--;
      if (this.checkCollision()) {
        this.piece.position.x++;
      }
    }
    if (event.key === "ArrowRight") {
      this.piece.position.x++;
      if (this.checkCollision()) {
        this.piece.position.x--;
      }
    }
    if (event.key === "ArrowDown") {
      this.piece.position.y++;
      if (this.checkCollision()) {
        this.piece.position.y--;
        this.solidifyPiece();
        this.removeRows();
      }
    }
    if (event.key === "ArrowUp") {
      const rotated: number[][] = [];
      for (let i = 0; i < this.piece.shape[0].length; i++) {
        const row: number[] = [];
        for (let j = this.piece.shape.length - 1; j >= 0; j--) {
          row.push(this.piece.shape[j][i]);
        }
        rotated.push(row);
      }
      const previousShape = this.piece.shape;
      this.piece.shape = rotated;
      if (this.checkCollision()) {
        this.piece.shape = previousShape;
      }
    }
  }

  reiniciar(){
    this.gameOver = false;
    this.score = 0;
    this.board.forEach((row)=> row.fill(0));
  }
  volverAlHome(){
    this.router.navigate(['/home']);
  }
}


