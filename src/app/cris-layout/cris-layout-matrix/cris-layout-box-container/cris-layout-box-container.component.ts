import {
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
  ViewContainerRef,
  QueryList,
  ViewChildren,
  Injector
} from '@angular/core';

import { Box } from '../../../core/layout/models/box.model'
import { getCrisLayoutPage } from '../../decorators/cris-layout-page.decorator';
import { getCrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { CrisLayoutLoaderDirective } from '../../directives/cris-layout-loader.directive';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { TranslateService } from '@ngx-translate/core';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { catchError, takeUntil, tap, take } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { Item } from '../../../core/shared/item.model';
import { LayoutBox } from '../../enums/layout-box.enum';
import { hasValue } from '../../../shared/empty.util';

@Component({
  selector: 'ds-cris-layout-box-container',
  templateUrl: './cris-layout-box-container.component.html',
  styleUrls: ['./cris-layout-box-container.component.scss']
})
export class CrisLayoutBoxContainerComponent implements OnInit {

  @Input() box: Box;

  /**
   * Item that is being viewed
   */
  @Input() item: Item;

  componentLoader;

  /**
   * The prefix used for box header's i18n key
   */
  boxI18nPrefix = 'layout.box.header.';

  /**
   * The i18n key used for box's header
   */
  boxHeaderI18nKey = '';

  activeIds: string[] = [];

  /**
   * componentRef reference of the component that will be created
   */
  componentRef: ComponentRef<Component>;

  /**
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  constructor(
    private injector: Injector,
    protected translateService: TranslateService,
    protected componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {

    this.objectInjector = Injector.create({
      providers: [
        {provide: 'boxProvider', useFactory: () => (this.box), deps: []},
        {provide: 'itemProvider', useFactory: () => (this.item), deps: []},
      ],
      parent: this.injector
    });

    this.componentLoader = this.getComponent();
    this.boxHeaderI18nKey = this.boxI18nPrefix + this.box.shortname;

    if (!hasValue(this.box.collapsed) || !this.box.collapsed) {
      this.activeIds.push(this.box.shortname);
    }
  }


  getComponent(): GenericConstructor<Component> {
    return getCrisLayoutBox(LayoutBox[this.box.boxType]);
  }

  getComponentRef(){
    return getCrisLayoutBox(LayoutBox[this.box.boxType])?.componentRef;
  }

  getBoxHeader(): string {
    const header: string = this.translateService.instant(this.boxHeaderI18nKey);
    if (header === this.boxHeaderI18nKey ) {
      // if translation does not exist return the value present in the header property
      return this.translateService.instant(this.box.header);
    } else {
      return header;
    }
  }


}
