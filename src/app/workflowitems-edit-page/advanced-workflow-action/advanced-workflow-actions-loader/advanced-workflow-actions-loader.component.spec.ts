/* eslint-disable max-classes-per-file */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionsLoaderComponent } from './advanced-workflow-actions-loader.component';
import { Router } from '@angular/router';
import { RouterStub } from '../../../shared/testing/router.stub';
import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Directive, Injector, NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
import { AdvancedWorkflowActionsDirective } from './advanced-workflow-actions.directive';
import {
  rendersAdvancedWorkflowTaskOption
} from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { By } from '@angular/platform-browser';
import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

const ADVANCED_WORKFLOW_ACTION_TEST = 'testaction';

describe('AdvancedWorkflowActionsLoaderComponent', () => {
  let component: AdvancedWorkflowActionsLoaderComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionsLoaderComponent>;

  let router: RouterStub;
  let mockComponentFactoryResolver: any;

  beforeEach(async () => {
    router = new RouterStub();
    mockComponentFactoryResolver = {
      resolveComponentFactory: jasmine.createSpy('resolveComponentFactory').and.returnValue(
        AdvancedWorkflowActionTestComponent
      ),
    };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AdvancedWorkflowActionsDirective,
        RouterTestingModule,
        AdvancedWorkflowActionsLoaderComponent,
        AdvancedWorkflowActionTestComponent,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: ComponentFactoryResolver, useValue: mockComponentFactoryResolver },
        { provide: Injector, useValue: {} },
        ViewContainerRef
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AdvancedWorkflowActionsLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
        entryComponents: [AdvancedWorkflowActionTestComponent],
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionsLoaderComponent);
    component = fixture.componentInstance;
    component.type = ADVANCED_WORKFLOW_ACTION_TEST;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.debugElement.nativeElement.remove();
  });

  describe('When the component is rendered', () => {
    it('should display the AdvancedWorkflowActionTestComponent when the type has been defined in a rendersAdvancedWorkflowTaskOption', () => {
      spyOn(component, 'getComponentByWorkflowTaskOption').and.returnValue(AdvancedWorkflowActionTestComponent);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getComponentByWorkflowTaskOption).toHaveBeenCalledWith(ADVANCED_WORKFLOW_ACTION_TEST);
      expect(fixture.debugElement.query(By.css('#AdvancedWorkflowActionsLoaderComponent'))).not.toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to page not found when the type has not been defined in a rendersAdvancedWorkflowTaskOption', () => {
      spyOn(component, 'getComponentByWorkflowTaskOption').and.returnValue(undefined);
      component.type = 'nonexistingaction';

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getComponentByWorkflowTaskOption).toHaveBeenCalledWith('nonexistingaction');
      expect(router.navigate).toHaveBeenCalledWith([PAGE_NOT_FOUND_PATH]);
    });
  });
});

@rendersAdvancedWorkflowTaskOption(ADVANCED_WORKFLOW_ACTION_TEST)
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: '<span id="AdvancedWorkflowActionsLoaderComponent"></span>',
  standalone: true
})
class AdvancedWorkflowActionTestComponent {
}

@Directive({
  selector: '[dsAdvancedWorkflowActions]',
  standalone: true
})
export class MockAdvancedWorkflowActionsDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
