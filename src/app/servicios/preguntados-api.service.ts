import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface MarvelCharacterResponse {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  etag: string;
  data: {
    offset: number;
    limit: number;
    total: number;
    count: number;
    results: Array<{
      id: number;
      name: string;
      description: string;
      modified: string;
      thumbnail: {
        path: string;
        extension: string;
      };
      resourceURI: string;
      comics: any;
      series: any;
      stories: any;
      events: any;
      urls: any;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})

export class PreguntadosApiService {
  clavePublica : string = "0fa96ab8fcdf050020f15ee8fbd5c0e8";
  listaHeroes : any[] = [];

  constructor(private http : HttpClient) {
  }

  getHeroes(): Observable<{ nombre: string; imagen: string }[]> {
    return this.http.get<MarvelCharacterResponse>(`https://gateway.marvel.com:443/v1/public/characters?ts=1&apikey=${this.clavePublica}&hash=dad167445e1f30058e70472636fce894`)
      .pipe(map(response => {
        return response.data.results.map(personaje => ({
          nombre: personaje.name,
          imagen: `${personaje.thumbnail.path}.${personaje.thumbnail.extension}`
        }));
      }));
  }
  getRickAndMortyPJ(){
    return this.http.get<any>("https://rickandmortyapi.com/api/character")
     .pipe(map(response => {
        return response.results.map((personaje: { name: any; image: any; }) => ({
          nombre: personaje.name,
          imagen: personaje.image
        }));
      }));
  }
}
