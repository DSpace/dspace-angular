import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }
  public  sharedData: any;
  public  Destinationpoint : any;
  public startingpoint : any;

  setSharedData(data: any) {
  
   this.sharedData = data;
  }

  getSharedData() {
   
    return this.sharedData;
    
  }


  setdestinationpoint(data: any){
    this.Destinationpoint = data;
  }

  setstartingpoint(data: any){
    this.startingpoint = data;
  }

  getdestinationpoint(){
     return this.Destinationpoint;
  }

  getstartingpoint(){
     return  this.startingpoint;
  }
}
