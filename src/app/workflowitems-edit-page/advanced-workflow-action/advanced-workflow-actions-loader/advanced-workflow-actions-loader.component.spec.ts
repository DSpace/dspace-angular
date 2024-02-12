import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionsLoaderComponent } from './advanced-workflow-actions-loader.component';
import { Router } from '@angular/router';
import { RouterStub } from '../../../shared/testing/router.stub';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicComponentLoaderDirective } from '../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import {
  rendersAdvancedWorkflowTaskOption
} from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { By } from '@angular/platform-browser';
import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';
import { getMockThemeService } from 'src/app/shared/mocks/theme-service.mock';

const ADVANCED_WORKFLOW_ACTION_TEST = 'testaction';

describe('AdvancedWorkflowActionsLoaderComponent', () => {
  let component: AdvancedWorkflowActionsLoaderComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionsLoaderComponent>;

  let router: RouterStub;
  let themeService: ThemeService;

  beforeEach(async () => {
    router = new RouterStub();
    themeService = getMockThemeService();

    await TestBed.configureTestingModule({
      declarations: [
        DynamicComponentLoaderDirective,
        AdvancedWorkflowActionsLoaderComponent,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: ThemeService, useValue: themeService },
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
      spyOn(component, 'getComponent').and.returnValue(AdvancedWorkflowActionTestComponent);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getComponent).toHaveBeenCalled();
      expect(fixture.debugElement.query(By.css('#AdvancedWorkflowActionsLoaderComponent'))).not.toBeNull();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to page not found when the type has not been defined in a rendersAdvancedWorkflowTaskOption', () => {
      spyOn(component, 'getComponent').and.returnValue(undefined);
      component.type = 'nonexistingaction';

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.getComponent).toHaveBeenCalled();
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
