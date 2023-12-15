import { Injectable } from '@angular/core';
import { CategoryApiService } from '../generated/services/category-api.service';
import { ConfigurationService } from '../services/configuration/configuration.service.service';
import { Observable, mergeMap } from 'rxjs';
import { HttpContext, HttpEvent, HttpResponse } from '@angular/common/http';
import { CategoryResponse } from '../generated/interfaces/category-response';
import { SubcategoryResponse } from '../generated/interfaces/subcategory-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiFacadeService {

  constructor(private categoryApiService: CategoryApiService,
    private configurationService: ConfigurationService) { }

    /**
     * Get Category List
     * All categories list for trip search.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public categoryListGet(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<CategoryResponse>;
    public categoryListGet(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<CategoryResponse>>;
    public categoryListGet(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<CategoryResponse>>;
    public categoryListGet(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
      return this.configurationService.getConfigurationValue('api-server')
      .pipe(
          mergeMap(configurationValue => {
              return this.categoryApiService.categoryListGet(observe);
          }));
       
    }

    
    /**
     * Get Subcategory List
     * All Subcategory list for trip search, for the main category ref you can compare \&quot;interest_category_id\&quot; to categry id.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public categorySubCategoryGet(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<SubcategoryResponse>;
    public categorySubCategoryGet(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpResponse<SubcategoryResponse>>;
    public categorySubCategoryGet(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<HttpEvent<SubcategoryResponse>>;
    public categorySubCategoryGet(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json', context?: HttpContext}): Observable<any> {
      return this.configurationService.getConfigurationValue('api-server')
      .pipe(
          mergeMap(configurationValue => {
              return this.categoryApiService.categorySubCategoryGet(observe);
          }));
    }
}
