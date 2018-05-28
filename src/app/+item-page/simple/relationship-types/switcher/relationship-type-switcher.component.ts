import { Component, InjectionToken, Injector, Input, OnInit } from '@angular/core';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { Item } from '../../../../core/shared/item.model';
import { getComponentByRelationshipType } from '../../../../shared/entities/relationship-type-decorator';
import { rendersDSOType } from '../../../../shared/object-collection/shared/dso-element-decorator';
import { ListableObject } from '../../../../shared/object-collection/shared/listable-object.model';
import { ElementViewMode, SetViewMode } from '../../../../shared/view-mode';

export const ITEM: InjectionToken<string> = new InjectionToken<string>('item');

@Component({
  selector: 'ds-relationship-type-switcher',
  styleUrls: ['./relationship-type-switcher.component.scss'],
  templateUrl: './relationship-type-switcher.component.html'
})
export class RelationshipTypeSwitcherComponent implements OnInit {
  @Input() item: Item;
  @Input() viewMode: ElementViewMode;
  objectInjector: Injector;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [{ provide: ITEM, useFactory: () => this.item, deps:[] }],
      parent: this.injector
    });

  }

  getComponent(): string {
    const type = this.item.findMetadata('relationship.type');
    return getComponentByRelationshipType(type, this.viewMode);
  }
}
