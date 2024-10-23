import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import { Router } from '@angular/router';
import {addDoc, collection, collectionData, where, orderBy, Firestore, limit, query, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  error:string = '';
  exito:boolean = true;

  constructor(private firebaseService: FirebaseService, private firestore : Firestore, private router : Router) { }

  async register() {
    try{
          await this.firebaseService.register(this.email, this.password).then(() => {
          let col = collection(this.firestore, "logins");
          let obj = {fecha : new Date(), "user": this.email}
          addDoc(col, obj)
          this.showSuccessAlert("Te logueamos automaticamente")
          this.router.navigate(['/home']);
      });
    }
    catch(e:any){
      this.exito = false;
      switch(e.code){
        case 'auth/email-already-in-use':
       this.error = 'La dirección de correo electrónico ya está en uso.';
       break;
       case 'auth/invalid-email':
       this.error = 'Email invalido';
       break;
      case 'auth/weak-password':
       this.error = 'la contraseña debe tener 6 caracteres';
       break;
      case 'auth/operation-not-allowed':
        this.error = 'Esta operación no está permitida.';
        break;
      case 'auth/requires-recent-login':
        this.error = 'Debes iniciar sesión recientemente para realizar esta operación.';
        break;
      default:
        this.error = 'Email o contraseña invalido';
        break;
      }
      console.log(e.code);
    }
  }
  volverAlHome(){
    this.router.navigate(['/home']);
  }
  private showSuccessAlert(message: string) {
    return Swal.fire({
      title: 'Registro exitoso',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }
}
