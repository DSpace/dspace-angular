import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Vedette } from '../models/Vedette';

@Injectable({
  providedIn: 'root',
})
export class VedetteService {
  private urlApi = 'http://localhost:3000/api/vedette';
  private imagesHomeCache$?: Observable<Vedette[]>;
  private imageCollCache$: { [id: string]: Observable<Vedette[]> } = {};

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les images de la page d'accueil
  getImagesHome(): Observable<Vedette[]> {
    // Si les images ne sont pas en cache, effectuer la requête et mettre en cache les résultats
    if (!this.imagesHomeCache$) {
      this.imagesHomeCache$ = this.fetchImages(this.urlApi).pipe(shareReplay(1));
    }
    return this.imagesHomeCache$;
  }

  // Méthode pour récupérer les images d'une collection par ID
  getImagesColl(id: string): Observable<Vedette[]> {
    const limit = 1;
    // Si les images de la collection ne sont pas en cache, effectuer la requête et mettre en cache les résultats
    if (!this.imageCollCache$[id]) {
      this.imageCollCache$[id] = this.fetchImages(`${this.urlApi}/${limit}/${id}`).pipe(shareReplay(1));
    }
    return this.imageCollCache$[id];
  }

  // Méthode pour effectuer la requête HTTP et transformer les données
  private fetchImages(apiUrl: string): Observable<Vedette[]> {
    return this.http.get(apiUrl).pipe(
      map((data: any) =>
        data.items.map((item: any) => ({
          title: item.title,
          description: item.description,
          imageUrl: item.group.image[0].url,
        } as Vedette))
      ),
      catchError((error) => {
        console.error('Error fetching images', error);
        return of([]); // Retourner une liste vide en cas d'erreur
      })
    );
  }

  // Méthode pour mélanger un tableau
  shuffleArray(array: Vedette[]): Vedette[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
}
