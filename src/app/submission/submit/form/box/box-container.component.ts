import {
  Component, ComponentFactoryResolver, Host, Input, TemplateRef, Type, ViewChild,
  ViewContainerRef
} from '@angular/core';

export const BOX_MODEL_TEMPLATE = `
  <div dsBox #box="boxRef" [mandatory]="mandatory" [animation]="animations">
    <ngb-accordion #acc="ngbAccordion" (panelChange)="box.panelChange($event)" activeIds="{{ boxId }}">
      <ngb-panel id="{{ boxId }}" >
        <ng-template ngbPanelTitle>
          <span>{{ boxName }}</span>
          <div class="d-inline-block float-right">
            <i class="fa fa-exclamation-circle text-warning mr-3" aria-hidden="true"></i>
            <a class="close" aria-label="Close">
              <span *ngIf="box.isOpen()" class="fa fa-angle-up fa-fw" aria-hidden="true"></span>
              <span *ngIf="!box.isOpen()" class="fa fa-angle-down fa-fw" aria-hidden="true"></span>
            </a>
            <a class="close mr-3" *ngIf="box.isOptional()">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
            </a>
          </div>
        </ng-template>
        <ng-template ngbPanelContent>
          <div class="card-block">
            <ng-container
              *ngTemplateOutlet="boxContentTemplate">
            </ng-container>
          </div>
        </ng-template>
      </ngb-panel>
    </ngb-accordion>
  </div>

  <ng-template #boxContentTemplate>
    <ng-container dsInjectBoxTemplate [component]="boxComponent" [compileContext]="this"></ng-container>
  </ng-template>
`

@Component({
  template: BOX_MODEL_TEMPLATE
})
export class BoxContainerComponent {
  @Input() boxId: string;
  @Input() boxName: string;
  @Input() animations: boolean;
  @Input() mandatory: boolean;
  @Input() boxComponent: Type<any>;

}
