import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { VedetteService } from '../../../service/vedette.service'; // Mettez le bon chemin
import { Vedette } from '../../../models/Vedette'; // Mettez le bon chemin

@Component({
  selector: 'ds-vedette-liste',
  templateUrl: './vedette-liste.component.html',
  styleUrls: ['./vedette-liste.component.scss'],
  providers: [NgbCarouselConfig],
})
export class VedetteListeComponent implements OnInit {
  images: Vedette[] = [];

  constructor(
    private vedetteService: VedetteService,
    private config: NgbCarouselConfig
  ) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.vedetteService.getImages().subscribe((images) => {
      this.images = images;
    });
  }
}
