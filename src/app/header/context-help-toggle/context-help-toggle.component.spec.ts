import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextHelpToggleComponent } from './context-help-toggle.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ContextHelpService } from '../../shared/context-help.service';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ContextHelpToggleComponent', () => {
  let component: ContextHelpToggleComponent;
  let fixture: ComponentFixture<ContextHelpToggleComponent>;
  let contextHelpService;

  beforeEach(async () => {
    contextHelpService = jasmine.createSpyObj('contextHelpService',
      ['toggleIcons']);
    await TestBed.configureTestingModule({
      declarations: [ ContextHelpToggleComponent ],
      providers: [
        { provide: ContextHelpService, useValue: contextHelpService },
      ],
      imports: [ TranslateModule.forRoot() ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextHelpToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking the button should toggle context help icon visibility', () => {
    fixture.debugElement.query(By.css('a')).nativeElement.click();
    expect(contextHelpService.toggleIcons).toHaveBeenCalled();
  });
});
