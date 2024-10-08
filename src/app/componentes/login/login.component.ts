import { AfterViewInit, Component, OnInit, output } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import { Router } from '@angular/router';
import {addDoc, collection, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit {
  email: string = '';
  password: string = '';
  error:string = '';
  exito = true;

  constructor(private router: Router,private firestore : Firestore ,private firebaseService: FirebaseService ) {
  }

  ngAfterViewInit(): void {
    console.log("login");
  }
  

  async login() {
  try{
    // Implementación de la autenticación con Firebase
      await this.firebaseService.login(this.email, this.password).then(() => {
      let col = collection(this.firestore, "logins");
      let obj = {fecha : new Date(), "user": this.email}
      addDoc(col, obj);
      this.router.navigate(['/home']);
    });
  }catch(e:any){
    this.exito = false;
    switch (e.code) {
      case 'auth/invalid-email':
        this.error = 'La dirección de correo electrónico es inválida.';
        break;
      case 'auth/invalid-credential':
        this.error = 'Contraseña o mail incorrectos.';
        break;
      case 'auth/user-disabled':
        this.error ='La cuenta de usuario ha sido deshabilitada.';
        break;
      case 'auth/user-not-found':
        this.error ='No se encuentra una cuenta con esta dirección de correo electrónico.';
        break;
      case 'auth/wrong-password':
        this.error ='La contraseña proporcionada es incorrecta.';
        break;
      default:
        this.error ='Error desconocido.';
        break;
    }
    console.log(e.code);
  }
  }
  
  AutoCompletar() {
    this.email = "admin@gmail.com";
    this.password = "hola123";
  }

  volverAlHome(){
    this.router.navigate(['/home']);
  }
}
