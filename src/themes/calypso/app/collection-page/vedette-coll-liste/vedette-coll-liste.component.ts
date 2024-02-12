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

      // Vérifier si this.collectionId est défini avant de faire la requête
      if (this.collectionId) {
        // Utiliser l'ID de la collection pour récupérer les images
        this.images$ = this.vedetteService.getImagesColl(this.collectionId).pipe(
          map(images => images)
        );
      } else {
        console.error('ID de collection non défini');
        // Gérer le cas où l'ID de la collection n'est pas défini, par exemple, rediriger ou afficher un message d'erreur.
      }
    });
  }
}
