import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CardsApiFacadeService } from 'src/app/commons/facade/cards-api-facade.service';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {

  showPaymentForm: boolean = false;
  addPaymentForm: boolean = false;
  savedCards: any;
  constructor(private cardApiFacadeService: CardsApiFacadeService) { }

  ngOnInit(): void {
  this.loadData(); 
  }

  loadData() {
    this.cardApiFacadeService.cardsGet().pipe().subscribe((data) => {
      console.log(data);
      if (!!data && !!data.data) {
        this.savedCards = data.data;
      }
    });
  }

  openPatmentContent() {
    this.cardApiFacadeService.cardsGet().pipe().subscribe((data) => {
      if (!!data && !!data.data) {
        this.savedCards = data.data;
      }
    });
    this.addPaymentForm = true;
    this.showPaymentForm = !this.showPaymentForm;
  }

  deleteCard(data:any) {
    this.cardApiFacadeService.cardIdDelete(data.id).pipe().subscribe((data)=>{
      if(data.status === 1) {
        this.loadData();
      }
    });
  }

  onintlize() {
    this.addPaymentForm = false;
  }

}
