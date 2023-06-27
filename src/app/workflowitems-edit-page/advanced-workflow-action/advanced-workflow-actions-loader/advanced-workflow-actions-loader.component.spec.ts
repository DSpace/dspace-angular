import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';
import { rendersAdvancedWorkflowTaskOption } from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { RouterStub } from '../../../shared/testing/router.stub';
import { AdvancedWorkflowActionsDirective } from './advanced-workflow-actions.directive';
import { AdvancedWorkflowActionsLoaderComponent } from './advanced-workflow-actions-loader.component';

const ADVANCED_WORKFLOW_ACTION_TEST = 'testaction';

describe('AdvancedWorkflowActionsLoaderComponent', () => {
  let component: AdvancedWorkflowActionsLoaderComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionsLoaderComponent>;

  let router: RouterStub;

  beforeEach(async () => {
    router = new RouterStub();

    await TestBed.configureTestingModule({
      declarations: [
        AdvancedWorkflowActionsDirective,
        AdvancedWorkflowActionsLoaderComponent,
      ],
      providers: [
        { provide: Router, useValue: router },
      ],
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
})
class AdvancedWorkflowActionTestComponent {
}
