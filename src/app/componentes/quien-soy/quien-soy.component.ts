import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent {
  nombre: string = 'Quintana Miño Manuel';
  dni: string = '46629009';
  legajo: string = '114681';
  titulo: string = 'Quien Soy';
  descripcion: string = 'Soy un actual estudiante de programacion en la UTN.';
  lenguajes: { nombre: string, imagen: string }[] = [
    { nombre: 'TypeScript', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2Ftypescript.png?alt=media&token=30c3f969-add2-4654-a6c6-3571277778e4' },
    { nombre: 'Python', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2Fpython.jfif?alt=media&token=b2b2368e-e6fb-4efe-854b-d47fab6afb98' },
    { nombre: 'C#', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2FC%23.png?alt=media&token=cc1bb8f5-315c-44d7-b177-03f4898d8bd2' },
    { nombre: 'Php', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2Fphp.png?alt=media&token=1b9e747a-c38f-49e4-bb6b-7e8bd859ab06' }
  ];
  entornos: { nombre: string, imagen: string }[] = [
    { nombre: 'NodeJs', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2Fnodejs.png?alt=media&token=95092838-43e8-4807-a639-463e7cb45254' },
  ];
  frameworks: { nombre: string, imagen: string }[] = [
    { nombre: 'Angular', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2Fangular.png?alt=media&token=0ac133f5-bfc6-4fe0-8bff-7b77df1015ae' },
    { nombre: 'Slim', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2Fslim.png?alt=media&token=84381430-0467-4393-9cb3-3b76463a9707' },
    { nombre: 'Ionic', imagen: 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/quien-soy%2Fionic.png?alt=media&token=9ebcb5cf-dee1-461e-9425-ffd8b4130f06' }
  ];
  contacto: string = 'manu.quintanamino@gmail.com';
  descripcionJuego: string = 'El juego propio se basa en un tetris'+
  ', el cual se juega con las flechitas del teclado, el objetivo es ir'+
  ' llenando filas para que se borren e ir sumando puntos, pierdes cuando'+
  ' la pieza actual toca la parte superior de la pantalla';
  imagen: string = 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/IMG_2395.jpeg?alt=media&token=8a9ef211-a5bf-41e0-92e7-4f092f7a4a6f';

  constructor(private router: Router){
  }
  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
