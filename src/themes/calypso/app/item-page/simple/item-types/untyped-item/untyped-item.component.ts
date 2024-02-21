import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { Item } from '../../../../../../../app/core/shared/item.model';
import { ViewMode } from '../../../../../../../app/core/shared/view-mode.model';
import {
  listableObjectComponent
} from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../../../app/core/shared/context.model';
import {
  UntypedItemComponent as BaseComponent
} from '../../../../../../../app/item-page/simple/item-types/untyped-item/untyped-item.component';
import {MetadataMap} from "../../../../../../../app/core/shared/metadata.models";
import {BehaviorSubject, Observable, of} from "rxjs";
import {filter, map} from "rxjs/operators";
import {RemoteData} from "../../../../../../../app/core/data/remote-data";
import {hasValue} from "../../../../../../../app/shared/empty.util";
import {Data} from "@angular/router";
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
  activeTab: number = 1; // Propriété pour suivre l'onglet actif

  metadata$: Observable<MetadataMap>;
  subs: any[] = []; // Ajoutez cette ligne pour initialiser la propriété subs
  itemRD$: BehaviorSubject<RemoteData<Item>>;
  fromSubmissionObject = false;


  ngOnInit() {
    super.ngOnInit();

    // Souscrire aux données de métadonnées depuis le composant FullItemPageComponent
    this.metadata$ = this.itemRD$.pipe(
      map((rd: RemoteData<Item>) => rd.payload),
      filter((item: Item) => hasValue(item)),
      map((item: Item) => item.metadata)
    );
    console.log(this.metadata$);
  }

  // Fonction pour masquer la section par son id
  hideSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'none';
    }
  }

  // Fonction pour afficher la section par son id
  displaySection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'block';
    }
  }
}
