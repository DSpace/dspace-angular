import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { LdnServicesService } from "../ldn-services-data/ldn-services-data.service";

@Injectable({
  providedIn: 'root',
})
export class LdnDirectoryService {
  private itemFilterEndpoint = 'http://localhost:8080/server/api/config/itemfilters';


  constructor(private http: HttpClient,
              private ldnServicesService: LdnServicesService) {}
  public getItemFilters(): Observable<any> {

    return this.ldnServicesService.findAll().pipe(
        map((servicesData) => {
          return servicesData;
        })
    );
  }

}



