import {
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Box } from '../../../core/layout/models/box.model';
import { CrisLayoutLoaderDirective } from '../../directives/cris-layout-loader.directive';
import { CrisLayoutTabModelComponent as CrisLayoutTabObj } from '../../models/cris-layout-tab.model';
import { LayoutPage } from '../../enums/layout-page.enum';
import { LayoutTab } from '../../enums/layout-tab.enum';
import { BoxDataService } from '../../../core/layout/box-data.service';
import { CrisLayoutTab } from '../../decorators/cris-layout-tab.decorator';
import { getFirstSucceededRemoteListPayload } from '../../../core/shared/operators';
import { getCrisLayoutBox } from '../../decorators/cris-layout-box.decorator';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

/**
 * This component defines the default layout for all tabs of DSpace Items.
 * This component can be overwritten for a specific Item type using
 * CrisLayoutTabModelComponent decorator
 */
@Component({
  selector: 'ds-cris-layout-default-tab',
  templateUrl: './cris-layout-default-tab.component.html',
  styleUrls: ['./cris-layout-default-tab.component.scss']
})
@CrisLayoutTab(LayoutPage.DEFAULT, LayoutTab.DEFAULT)
export class CrisLayoutDefaultTabComponent extends CrisLayoutTabObj implements OnInit, OnDestroy {

  boxes: Box[];

  /**
   * Directive hook used to place the dynamic child component
   */
  @ViewChild(CrisLayoutLoaderDirective, {static: true}) crisLayoutLoader: CrisLayoutLoaderDirective;

  showLoader: boolean;

  componentRef: ComponentRef<Component>[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    public cd: ChangeDetectorRef,
    protected boxService: BoxDataService,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    super();
  }

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroyBoxes();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  protected initializeComponent() {
    this.showLoader = true;
    this.setBoxes(false).subscribe(() => {
      const viewContainerRef = this.crisLayoutLoader.viewContainerRef;
      viewContainerRef.clear();
      this.boxes.forEach((box, index) => {
        let nextBoxClear = true;

        if ( !!this.boxes[ index + 1 ] ) {
          nextBoxClear = this.boxes[ index + 1 ].clear;
        }

        const componentRef = this.createBox(viewContainerRef, box, index, nextBoxClear);
        this.componentRef.push(componentRef);
      });
      this.cd.markForCheck();
      this.showLoader = false;
    });
  }


  protected createBox(viewContainerRef: ViewContainerRef, box: Box, boxPosition: number, nextBoxClear?: boolean): ComponentRef<Component> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.getComponent(box.boxType)
    );

    const componentRef = this.instantiateBox(viewContainerRef, componentFactory, box, boxPosition, nextBoxClear);

    (componentRef.instance as any).refreshTab.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.refreshTab.emit();
    });
    (componentRef.instance as any).refreshBox.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.onRefreshBox(viewContainerRef, componentRef, box, boxPosition);

    });

    this.cd.markForCheck();

    return componentRef;
  }

  protected destroyBox(componentRef: ComponentRef<Component>) {
    componentRef.destroy();
  }

  protected destroyBoxes() {
    if (this.componentRef && this.componentRef.length > 0) {
      this.componentRef.forEach((component) => {
        this.destroyBox(component);
      });
    }
  }

  instantiateBox(viewContainerRef: ViewContainerRef, componentFactory: ComponentFactory<any>, box: Box, boxPosition: number, nextBoxClear?: boolean): ComponentRef<any> {
    const componentRef = viewContainerRef.createComponent(componentFactory, boxPosition);
    (componentRef.instance as any).item = this.item;
    (componentRef.instance as any).box = box;
    (componentRef.instance as any).nextBoxClear = nextBoxClear;
    return componentRef;
  }

  protected onRefreshBox(viewContainerRef: ViewContainerRef, componentRef: ComponentRef<Component>, box: Box, boxPosition: number) {
    this.setBoxes(false).subscribe((boxes) => {
      this.boxes = boxes;
      const refreshedBox = boxes.find((b) => b.id === box.id);
      if (refreshedBox) {
        this.destroyBox(componentRef);

        let nextBoxClear = true;

        if ( !!this.boxes[ boxPosition + 1 ] ) {
          nextBoxClear = this.boxes[ boxPosition + 1 ].clear;
        }

        this.createBox(viewContainerRef, refreshedBox, boxPosition,nextBoxClear);
      }
    });
  }

  protected getComponent(boxType: string): GenericConstructor<Component> {
    return getCrisLayoutBox(this.item, this.tab.shortname, boxType);
  }

  protected setBoxes(useCachedVersionIfAvailable: boolean): Observable<Box[]> {
    return this.boxService.findByItem(this.item.id, this.tab.id, useCachedVersionIfAvailable, followLink('configuration'))
      .pipe(
        getFirstSucceededRemoteListPayload(),
        tap((boxes: Box[]) => {
          this.boxes = boxes;
        }),
        catchError((error) => {
          this.boxes = [];
          return of(this.boxes);
        })
      );
  }


}
