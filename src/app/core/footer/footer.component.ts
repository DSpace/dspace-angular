import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
})
export class FooterComponent implements OnInit {

  dateObj: number = Date.now();

  constructor() {
  }

  ngOnInit(): void {
  }

}
