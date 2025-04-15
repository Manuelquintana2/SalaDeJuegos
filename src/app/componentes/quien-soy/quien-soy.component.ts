import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../servicios/storage.service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent {
  private storageService = inject(StorageService);
  cargando = true;

  nombre: string = 'Quintana Miño Manuel';
  dni: string = '46629009';
  legajo: string = '114681';
  titulo: string = 'Quien Soy';
  descripcion: string = 'Soy un actual estudiante de programación en la UTN.';

  lenguajes: { nombre: string, imagen: string }[] = [];
  entornos: { nombre: string, imagen: string }[] = [];
  frameworks: { nombre: string, imagen: string }[] = [];

  contacto: string = 'manu.quintanamino@gmail.com';
  descripcionJuego: string = 'El juego propio se basa en un tetris' +
    ', el cual se juega con las flechitas del teclado, el objetivo es ir' +
    ' llenando filas para que se borren e ir sumando puntos, pierdes cuando' +
    ' la pieza actual toca la parte superior de la pantalla';

  imagen: string = '';

  constructor(private router: Router) {
    this.cargarImagenes();
  }

  async cargarImagenes() {
    try {
      const [ts, python, csharp, php] = await Promise.all([
        this.storageService.obtenerImagen('quien-soy/typescript.png'),
        this.storageService.obtenerImagen('quien-soy/python.jfif'),
        this.storageService.obtenerImagen('quien-soy/C#.png'),
        this.storageService.obtenerImagen('quien-soy/php.png')
      ]);
      this.lenguajes = [
        { nombre: 'TypeScript', imagen: ts },
        { nombre: 'Python', imagen: python },
        { nombre: 'C#', imagen: csharp },
        { nombre: 'Php', imagen: php }
      ];

      const [node] = await Promise.all([
        this.storageService.obtenerImagen('quien-soy/nodejs.png')
      ]);
      this.entornos = [
        { nombre: 'NodeJs', imagen: node }
      ];

      const [angular, slim, ionic] = await Promise.all([
        this.storageService.obtenerImagen('quien-soy/angular.png'),
        this.storageService.obtenerImagen('quien-soy/slim.png'),
        this.storageService.obtenerImagen('quien-soy/ionic.png')
      ]);
      this.frameworks = [
        { nombre: 'Angular', imagen: angular },
        { nombre: 'Slim', imagen: slim },
        { nombre: 'Ionic', imagen: ionic }
      ];

      this.imagen = await this.storageService.obtenerImagen('quien-soy/YoIMG.jpeg');
    } catch (error) {
      console.error('Error cargando imágenes:', error);
    } finally {
      this.cargando = false;
    }
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }
}
