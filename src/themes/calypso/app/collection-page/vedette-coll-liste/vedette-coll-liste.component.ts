import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Vedette } from '../../../models/Vedette';
import { VedetteService } from '../../../service/vedette.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import {map} from "rxjs/operators";

@Component({
  selector: 'ds-vedette-coll-liste',
  templateUrl: './vedette-coll-liste.component.html',
  styleUrls: ['./vedette-coll-liste.component.scss']
})
export class VedetteCollListeComponent implements OnInit {
  images$: Observable<Vedette[]>;
  collectionId: string; // Variable pour stocker l'ID de la collection

  constructor(
    private vedetteService: VedetteService,
    private config: NgbCarouselConfig,
    private route: ActivatedRoute // Injecter ActivatedRoute
  ) {
    config.interval = 3000;
    config.wrap = true;
    config.keyboard = false;
  }

  ngOnInit(): void {
    // Récupérer l'ID de la collection à partir des paramètres de l'URL
    this.route.params.subscribe(params => {
      this.collectionId = params['id'];
      // Utiliser l'ID de la collection pour récupérer les images
      this.images$ = this.vedetteService.getImagesColl(this.collectionId).pipe(
        map(images => this.vedetteService.shuffleArray(images)) // Mélanger le tableau d'images
      );
    });
  }
}
