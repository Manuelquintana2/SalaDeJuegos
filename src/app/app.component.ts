import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SalaDeJuegos';
  email = localStorage.setItem("email","manu@gmail.com");
  contrasena = localStorage.setItem("contrasena","manu2005");

  constructor(private router: Router) 
  {
    this.router.navigate(['/login']);
  }
  
}
