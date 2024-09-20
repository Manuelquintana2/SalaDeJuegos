import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { FirebaseService } from '../../servicios/firebase.service';
import { RegisterComponent } from '../register/register.component';
import { QuienSoyComponent } from '../quien-soy/quien-soy.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, QuienSoyComponent,ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  mostrarQuienSoy = false;
  mostrarChat = false;
  user!:any;

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
      this.user = this.firebaseService.getCurrentUser();
      console.log('Usuario en el componente:', this.user);
  }
  irALogin(){
    this.router.navigate(['/login']);
  }
  irARegister() {
    this.router.navigate(['/register']);
  }

  async logout() {
    await this.firebaseService.logout();
    this.user = this.firebaseService.getCurrentUser();
    console.log('Usuario en el componente:', this.user);
    this.router.navigate(['/home']);
  }

  juegos(juego:string) {
    switch(juego) {
      case 'ahorcado':
        this.router.navigate(['juegos',juego]);
        break;
      case 'mayorMenor':
        this.router.navigate(['/juegos/mayorMenor']);
        break;
      case 'preguntados':
        this.router.navigate(['/juegos/preguntados']);
        break;
    }

  }
  mostrarQuienSoyFn(){
    this.mostrarQuienSoy = !this.mostrarQuienSoy;
  }

  mostrarChatFn(){
    this.mostrarChat = !this.mostrarChat;
  }
}
