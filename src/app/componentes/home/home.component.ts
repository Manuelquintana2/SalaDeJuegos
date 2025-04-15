import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { FirebaseService } from '../../servicios/firebase.service';
import { RegisterComponent } from '../register/register.component';
import { QuienSoyComponent } from '../quien-soy/quien-soy.component';
import { ChatComponent } from '../chat/chat.component';
import Swal from 'sweetalert2';
import { StorageService } from '../../servicios/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, CommonModule ,QuienSoyComponent,ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  cargando = true;
  mostrarQuienSoy = false;
  mostrarChat = false;
  user!:any;
  imagenAhorcado!: string;
  imagenMayorMenor!: string;
  imagenPreguntados!: string;
  imagenTetris!: string;

  constructor(private router: Router, private firebaseService: FirebaseService, private storageService: StorageService) {}

  async ngOnInit() {
      this.user = this.firebaseService.getCurrentUser();
      console.log('Usuario en el componente:', this.user);
      this.imagenAhorcado = await this.storageService.obtenerImagen('juegos/ahorcado/Ahorcado6.jpg');
      this.imagenMayorMenor = await this.storageService.obtenerImagen('home/MayorMenor.jpg');
      this.imagenPreguntados = await this.storageService.obtenerImagen('home/Preguntados.jpg');
      this.imagenTetris = await this.storageService.obtenerImagen('tetris.png');
      this.cargando = false;
    }
  irALogin(){
    this.router.navigate(['/login']);
  }
  irARegister() {
    this.router.navigate(['/register']);
  }
  irAEncuesta(){
    this.router.navigate(['/encuesta']);
  }

  async logout() {
    await this.firebaseService.logout();
    this.user = this.firebaseService.getCurrentUser();
    console.log('Usuario en el componente:', this.user);
    this.showSuccessAlert("Inicia sesion para acceder a los juegos");
    this.router.navigate(['/home']);
  }

  juegos(juego:string) {
    this.router.navigate(['juegos',juego]); 
  }
  mostrarQuienSoyFn(){
    this.router.navigate(['/quien-soy']); 
  }

  mostrarChatFn(){
    this.mostrarChat = !this.mostrarChat;
  }
  private showSuccessAlert(message: string) {
    return Swal.fire({
      title: 'Cerraste sesion',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }
}
