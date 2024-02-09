import { Component, Inject, OnDestroy } from '@angular/core';
import { TopLevelCommunityListComponent as BaseComponent } from '../../../../../app/home-page/top-level-community-list/top-level-community-list.component';
import { Subject } from 'rxjs';
import { CommunityDataService } from '../../../../../app/core/data/community-data.service';
import { CollectionDataService } from '../../../../../app/core/data/collection-data.service';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';
import { PaginatedList } from '../../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { PaginationService } from '../../../../../app/core/pagination/pagination.service';
import { VedetteService } from '../../../service/vedette.service';
import { takeUntil } from 'rxjs/operators';
import { Vedette } from '../../../models/Vedette';

@Component({
  selector: 'ds-top-level-community-list',
  styleUrls: ['./top-level-community-list.component.scss'],
  // styleUrls: ['../../../../../app/home-page/top-level-community-list/top-level-community-list.component.scss'],
  templateUrl: './top-level-community-list.component.html'
  // templateUrl: '../../../../../app/home-page/top-level-community-list/top-level-community-list.component.html'
})

export class TopLevelCommunityListComponent extends BaseComponent implements OnDestroy {
  collections: any[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();
  loadingImages: boolean = true;

  constructor(
    private cdsCalypso: CommunityDataService,
    private collService: CollectionDataService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private paginationServiceCalypso: PaginationService,
    private vedetteService: VedetteService
  ) {
    super(appConfig, cdsCalypso, paginationServiceCalypso);
  }

  ngOnInit() {
    super.ngOnInit();

    this.communitiesRD$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((data: RemoteData<PaginatedList<any>>) => {
      if (data.hasSucceeded) {
        data.payload?.page?.forEach((community) => {
          this.findCollections(community);
        });
      }
    });
  }

// Récupérez les collections en fonction de l'ID d'une communauté
  findCollections(community: any) {
    try {
      if (community && community._links && community._links.collections) {
        // Appelez la méthode findByHref de CollectionDataService pour récupérer les données de la collection
        this.collService.findByHref(community._links.collections.href).pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe((collectionData) => {
          if(collectionData && collectionData.payload){
              const collectionsPageLinks = (collectionData.payload._links as any).page;
              collectionsPageLinks.forEach((collectionLink) => {
                const collectionUrl = collectionLink.href;
                // Effectuez une requête HTTP pour récupérer les données de la collection individuelle
                this.collService.findByHref(collectionUrl).pipe(
                  takeUntil(this.unsubscribe$)
                ).subscribe((individualCollectionData) => {
                  if (individualCollectionData && individualCollectionData.payload && individualCollectionData.payload._links) {
                    const collections = {
                      title: individualCollectionData.payload.metadata['dc.title'][0].value,
                      id: individualCollectionData.payload.id,
                      vedette: null
                    };
                    // Récupérez les images vedette de la collection
                    this.vedetteService.getImagesColl(collections.id).pipe(
                      takeUntil(this.unsubscribe$)
                    ).subscribe(
                      (images: Vedette[]) => {
                        if (images.length !== 0) {
                          collections.vedette = images[0].imageUrl;
                        }
                        this.loadingImages = false; // Indique que l'image est chargée
                      },
                      (erreur) => {
                        console.error('Une erreur s\'est produite lors de la récupération des images vedette', erreur);
                        this.loadingImages = false; // Indique que l'image n'a pas pu être chargée
                      }
                    );
                  // Ajoutez la collection à la liste des collections
                  this.collections.push(collections);
                }
              });
            });
          }
        });
      }
    } catch (error) {
      console.error('Une erreur s\'est produite :', error);
      this.loadingImages = false;
    }
  }

  ngOnDestroy() {
    // Désabonnez-vous lors de la destruction du composant
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    super.ngOnDestroy();
  }
}
