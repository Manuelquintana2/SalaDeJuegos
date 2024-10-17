import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, limit, orderBy, query, where } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntajeService {
  usuarioLogeado:any;
  constructor(private fireBaseService: FirebaseService, private fireStore : Firestore){    
  }
  guardarPuntaje(puntaje:number,juego:string){
    this.usuarioLogeado = this.fireBaseService.getCurrentUser();
    let fecha = new Date();
    let dia = String(fecha.getDay());
    switch(dia){
      case "0":
        dia = "Domingo";
        break;
      case "1":
        dia = "Lunes";
        break;
      case "2":
        dia = "Martes";
        break;
      case "3":
        dia = "Miércoles";
        break;
      case "4":
        dia = "Jueves";
        break;
      case "5":
        dia = "Viernes";
        break;
      case "6":
        dia = "Sábado";
        break;
    }
    let hora = fecha.getHours();
    let minutos = fecha.getMinutes();
    let tiempo = `${dia}, ${fecha.toLocaleDateString()} ${String(hora).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

    let col = collection(this.fireStore,'puntajes');

    let obj = {  id: this.usuarioLogeado.uid,
      usuario: this.usuarioLogeado.email, 
      fecha: tiempo,
      puntaje: puntaje,
      juego: juego,
      timestamp: new Date().getTime()
    };
    addDoc(col, obj);
  }

  obtenerPuntajes(juego:string): Observable<any[]>{
    let col = collection(this.fireStore,'puntajes');
    let queryRef = query(col, where('juego', '==', juego), orderBy('timestamp', 'desc'), limit(10));
    return collectionData(queryRef);    
  }
}
