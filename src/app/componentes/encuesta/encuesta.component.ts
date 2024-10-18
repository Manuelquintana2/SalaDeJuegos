import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../servicios/firebase.service';
import { addDoc, collection, collectionData, Firestore, limit, orderBy, query } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent implements OnInit  {

  form!:FormGroup;
  seguir = false;
  usuarioLogeado!: any;
  sub!: Subscription;
  listaUsers:any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private fireBase: FirebaseService, private fireStore : Firestore){
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombreCompleto: ['', [Validators.pattern('^[a-zA-Z\\s]+$'), Validators.required]],
      edad: ['', [Validators.min(18), Validators.max(99), Validators.required]],
      numeroTelefonico: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
      comentarios: ['', Validators.required], 
      recomendar: ['', Validators.required],
      consentimientoDatos: [false, Validators.requiredTrue] 
    });

    this.usuarioLogeado = this.fireBase.getCurrentUser();

    const col = collection(this.fireStore, 'encuesta');

    this.sub = collectionData(col).subscribe((respuesta:any) => {

      this.listaUsers = respuesta.map((item: { id: any; }) =>({
      idUsuario: item.id
      }));
    });
  }

  volverAlHome(){
    this.router.navigate(['/home']);
  }
  enviar() {
    if (this.form.valid) {
      let col = collection(this.fireStore,'encuesta');
      let obj = this.form.value;
      obj["id"] = this.usuarioLogeado.uid
      addDoc(col, obj);
    }
  }
}
