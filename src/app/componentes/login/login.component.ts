import { Component } from '@angular/core';
import { Usuario } from '../../../clases/Usuario';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  clave!: string;
  exito!: boolean;
  usuario!: Usuario;

  constructor(private router: Router) {}

  Validar(){
    if(this.email == localStorage.getItem("email") && this.clave == localStorage.getItem("contrasena")) {
      // Logeado correctamente
      this.usuario = new Usuario(this.email, this.clave);
      this.exito = true;
      this.router.navigate(['/home']);
      ;
    }else{
      // Error de logeo
      this.exito = false;
    }
  }
  Autocompletar(){
    this.email = localStorage.getItem("email") || "";
    this.clave = localStorage.getItem("contrasena") || "";
    
  }

}
