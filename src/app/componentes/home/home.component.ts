import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { FirebaseService } from '../../firebase.service';
import { RegisterComponent } from '../register/register.component';
import { QuienSoyComponent } from '../quien-soy/quien-soy.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, QuienSoyComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  mostrarLoguin = false;
  logueado = false;
  mostrarRegister = false;
  mostrarQuienSoy = false;
  json! : any;
  email!: string;

  constructor(private router: Router, private firebaseService: FirebaseService) {

  }

  mostrarLog() {

    this.mostrarLoguin = true;
  }
  mostrarReg() {

    this.mostrarRegister = true;
  }

  recibirDatos(datoLog : string){
  this.json = JSON.parse(datoLog);
  this.logueado = this.json.logueado;
  this.mostrarLoguin = this.json.mostrarForm;
  this.mostrarRegister = this.json.mostrarForm;
  this.email = this.json.email;
  }

  async logout() {
    await this.firebaseService.logout();
    this.logueado = false;
    // this.router.navigate(['/home']);
  }

  mostrarQuienSoyFn(){
    this.mostrarQuienSoy = !this.mostrarQuienSoy;
  }
}
