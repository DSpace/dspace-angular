import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import { Item } from '../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../../../app/core/shared/context.model';
import {
  UntypedItemComponent as BaseComponent
} from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import {ActivatedRoute, Router} from "@angular/router";
import {RouteService} from "../../../../../../../app/core/services/route.service";
import {ItemDataService} from "../../../../../../../app/core/data/item-data.service";

/**
 * Component that represents an untyped Item page
 */
@listableObjectComponent(Item, ViewMode.StandalonePage, Context.Any, 'calypso')
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  //styleUrls: ['../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  //templateUrl: '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends BaseComponent implements OnInit {
  activeTab: number = 1;
  metadata: any[] = [];  // Tableau pour stocker les métadonnées de l'élément
  itemRD : any;

  constructor(
    protected routeService: RouteService,
    protected router: Router,
    protected route: ActivatedRoute,
    private itemDataService: ItemDataService
  ) {
    super(routeService, router);
  }

  ngOnInit() {
    super.ngOnInit();

    // Récupérer l'ID de l'élément à partir de l'URL
    const itemId = this.route.snapshot.paramMap.get('id');

    // Appeler le service pour récupérer l'élément avec les métadonnées
    this.itemDataService.findById(itemId).subscribe(
      (item) => {
        this.itemRD = item;
        // Accéder aux métadonnées de l'élément
        this.metadata = Object.entries(item.payload.metadata).map(([key, value]) => ({
          label: key,
          value: this.extractMetadataValues(value),
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'élément :', error);
      }
    );
  }

  /**
   * Extraire les valeurs des métadonnées
   */
  extractMetadataValues(metadataValue: any): any {
    if (Array.isArray(metadataValue) && metadataValue.length > 0) {
      return metadataValue.map((mv) => mv.value);
    } else {
      return null;
    }
  }

  /**
   * Masquer une section de l'interface utilisateur
   */
  hideSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'none';
    }
  }

  /**
   * Afficher une section de l'interface utilisateur
   */
  displaySection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'block';
    }
  }

}
