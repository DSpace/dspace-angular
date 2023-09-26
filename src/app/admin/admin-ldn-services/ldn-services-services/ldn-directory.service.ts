import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LdnService } from '../ldn-services-model/ldn-services.model';

@Injectable({
  providedIn: 'root',
})
export class LdnDirectoryService {
  private baseUrl = 'http://localhost:8080/server/api/ldn/ldnservices';
  private itemFilterEndpoint = 'http://localhost:8080/server/api/config/itemfilters';


  constructor(private http: HttpClient) {}


  public listLdnServices(): Observable<LdnService[]> {
    const endpoint = `${this.baseUrl}`;
    return this.http.get<LdnService[]>(endpoint).pipe(
        tap(data => {
          console.log('listLdnServices() Data:', data);
        })
    );
  }

  public getLdnServiceById(id: string): Observable<LdnService> {
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.get<LdnService>(endpoint);
  }

  public createLdnService(ldnService: LdnService): Observable<LdnService> {
    return this.http.post<LdnService>(this.baseUrl, ldnService);
  }

  public updateLdnService(id: string, ldnService: LdnService): Observable<LdnService> {
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.put<LdnService>(endpoint, ldnService);
  }

  public deleteLdnService(id: string): Observable<void> {
    const endpoint = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(endpoint);
  }

  public searchLdnServicesByLdnUrl(ldnUrl: string): Observable<LdnService[]> {
    const endpoint = `${this.baseUrl}/search/byLdnUrl?ldnUrl=${ldnUrl}`;
    return this.http.get<LdnService[]>(endpoint);
  }

  public getItemFilters(): Observable<any> {
    const itemFiltersEndpoint = `${this.itemFilterEndpoint}`;
    return this.http.get(itemFiltersEndpoint);
  }

}



