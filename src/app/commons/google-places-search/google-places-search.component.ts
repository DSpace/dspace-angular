import { Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiServiceService, Maps } from 'src/app/home/api-service.service';
const place = null as google.maps.places.PlaceResult;
type Components = typeof place.address_components;

@Component({
  selector: 'app-google-places-search',
  templateUrl: './google-places-search.component.html',
  styleUrls: ['./google-places-search.component.scss']
})



export class GooglePlacesSearchComponent {
  
  @Input() title: string;
  @Input() formcontrol: FormControl;
  @Output() placeSelected: EventEmitter<google.maps.places.PlaceResult> = new EventEmitter<google.maps.places.PlaceResult>();

  @ViewChild('search')
  public searchElementRef: ElementRef;

  public place: google.maps.places.PlaceResult;
  public locationFields = [
    'name',
    'cityName',
    'stateCode',
    'countryName',
    'countryCode',
  ];
  private map: google.maps.Map;

  constructor(
    private ngZone: NgZone,
    private apiService: ApiServiceService
  ) { 
    apiService.api.then((maps) => {
      this.initAutocomplete(maps);
    });
  }
    
  initAutocomplete(maps: Maps) {
    let autocomplete = new maps.places.Autocomplete(this.searchElementRef.nativeElement);

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        this.place = autocomplete.getPlace();
        this.placeSelected.emit(this.place);
      });
    });
  }
}
