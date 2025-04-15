import { Injectable } from '@angular/core';
import { Storage, ref, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) {}

  // Devuelve la URL de una imagen específica
  async obtenerImagen(ruta: string): Promise<string> {
    const referencia = ref(this.storage, ruta);
    return await getDownloadURL(referencia);
  }
}
