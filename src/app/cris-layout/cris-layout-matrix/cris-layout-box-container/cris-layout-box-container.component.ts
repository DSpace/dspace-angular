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
  ViewChildren
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

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChildren(CrisLayoutLoaderDirective) crisLayoutLoader: QueryList<ViewContainerRef>;

  /**
   * componentRef reference of the component that will be created
   */
  componentRef: ComponentRef<Component>;

  constructor(protected translateService: TranslateService,
    protected componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    this.componentLoader = this.getComponent();
    this.boxHeaderI18nKey = this.boxI18nPrefix + this.box.shortname;
    // this.createBox();
  }

  ngAfterViewInit(){
    this.crisLayoutLoader.changes.subscribe((res)=>{
      if(!!res.first){
        this.createBox(res.first.viewContainerRef);
      }
    })
  }

  getComponent(): GenericConstructor<Component> {
    return getCrisLayoutBox(LayoutBox[this.box.boxType]);
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


  protected createBox(viewContainerRef) {
    if(!this.box.id){
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentLoader.componentRef);
    // const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance as any).box = this.box;
    (this.componentRef.instance as any).item = this.item;
    console.log(this.box,this.componentRef.instance);
    // (componentRef.instance as any).refreshTab.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
    //   this.refreshTab.emit();
    // });
    // (componentRef.instance as any).refreshBox.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
    //   this.onRefreshBox(viewContainerRef, componentRef, box, boxPosition);

    // });

  }

 
  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

}
