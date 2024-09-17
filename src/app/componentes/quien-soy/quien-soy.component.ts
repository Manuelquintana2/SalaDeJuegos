import { Component } from '@angular/core';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent {
  nombre: string = 'Quintana Miño Manuel';
  titulo: string = 'Quien Soy';
  descripcionJuego: string = '................................................................';
  imageUrl: string = 'https://firebasestorage.googleapis.com/v0/b/saladejuegos-ab2c4.appspot.com/o/IMG_2395.jpeg?alt=media&token=8a9ef211-a5bf-41e0-92e7-4f092f7a4a6f'; // Reemplaza con la URL de tu imagen
  

}
