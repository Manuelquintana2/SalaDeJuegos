import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormsModule} from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';
import { addDoc, collection, collectionData, Firestore, limit, orderBy, query } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit, OnDestroy  {

  usuarioLogeado:any;
  sub!: Subscription;
  mensajes: any[] = [
    
  ];
  nuevoMensaje: string = '';
  
  constructor(private fireBaseService: FirebaseService, private fireStore : Firestore) { }  // injectar el servicio de autenticación  //

    ngOnInit(): void {
      this.usuarioLogeado = this.fireBaseService.getCurrentUser();
      const col = collection(this.fireStore, 'chat');
    const filtererQuery = query(col, orderBy('timestamp', 'asc'));

    this.sub = collectionData(filtererQuery).subscribe((respuesta: any) => {
      // Asignar directamente a mensajes en lugar de usar push
      this.mensajes = respuesta.map((item: { usuario: any; id: any; mensaje: any; fecha: any; timestamp : any }) => ({
        emisor: item.usuario,
        idEmisor: item.id,  // para identificar al emisor en el mensaje
        texto: item.mensaje,
        fecha: item.fecha,
        timestamp: item.timestamp 
      }));
      this.scrollToBottom();
    });
    };
  
  enviarMensaje(){
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

    let col = collection(this.fireStore,'chat');
    let obj = {  id: this.usuarioLogeado.uid,
       usuario: this.usuarioLogeado.email, 
       fecha: tiempo, 
       mensaje: this.nuevoMensaje,
       timestamp: new Date().getTime()};
    setTimeout(() => {
      this.nuevoMensaje ="";
      this.scrollToBottom();
    }, 30);
    addDoc(col, obj);
  }

  scrollToBottom() {
    const messagesContainer = document.querySelector('.chat-messages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Desplazar al fondo
    }
}
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
