// vedette.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Vedette } from '../models/Vedette'; // Mettez le bon chemin

@Injectable({
  providedIn: 'root',
})
export class VedetteService {
  private imagesCache: Vedette[] | null = null;

  constructor(private http: HttpClient) {}

  getImages(): Observable<Vedette[]> {
    // Si les données sont en cache, les renvoyer directement
    if (this.imagesCache) {
      return of(this.imagesCache);
    }

    // Sinon, faire la requête HTTP
    return this.http.get('http://localhost:3000/api/vedette').pipe(
      map((data: any) =>
        data.items.map(item => ({
          title: item.title,
          description: item.description,
          imageUrl: item.group.image[0].url
        } as Vedette))
      ),
      catchError((error) => {
        console.error('Error fetching images', error);
        return of([]); // Retourner une liste vide en cas d'erreur
      }),
      map((images) => {
        // Stocker les données en cache
        this.imagesCache = images;
        return images;
      })
    );
  }
}
