import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { VedetteService } from '../../../service/vedette.service';
import { Vedette } from '../../../models/Vedette';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-vedette-liste',
  templateUrl: './vedette-liste.component.html',
  styleUrls: ['./vedette-liste.component.scss'],
  providers: [NgbCarouselConfig],
})
export class VedetteListeComponent implements OnInit {
  images$: Observable<Vedette[]>;

  constructor(
    private vedetteService: VedetteService,
    private config: NgbCarouselConfig
  ) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.images$ = this.vedetteService.getImages();
  }
}
