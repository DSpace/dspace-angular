import {
  NO_ERRORS_SCHEMA,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ScriptParameter } from '../../../scripts/script-parameter.model';
import { ScriptParameterType } from '../../../scripts/script-parameter-type.model';
import { ParameterValueInputComponent } from '../parameter-value-input/parameter-value-input.component';
import { ParameterSelectComponent } from './parameter-select.component';

describe('ParameterSelectComponent', () => {
  let component: ParameterSelectComponent;
  let fixture: ComponentFixture<ParameterSelectComponent>;
  let scriptParams: ScriptParameter[];

  const translateServiceStub = {
    get: () => of('---'),
  };

  function init() {
    scriptParams = [
      Object.assign(
        new ScriptParameter(),
        {
          name: '-a',
          type: ScriptParameterType.BOOLEAN,
        },
      ),
      Object.assign(
        new ScriptParameter(),
        {
          name: '-f',
          type: ScriptParameterType.FILE,
        },
      ),
    ];
  }
  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [FormsModule, ParameterSelectComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ParameterSelectComponent, {
        remove: {
          imports: [ParameterValueInputComponent],
        },
        add: {
          imports: [MockTranslatePipe],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterSelectComponent);
    component = fixture.componentInstance;

    component.parameters = scriptParams;
    component.removable = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the remove button when removable', () => {
    component.removable = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button.remove-button'));
    expect(button).not.toBeNull();
  });

  it('should hide the remove button when not removable', () => {
    component.removable = false;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button.remove-button'));
    expect(button).toBeNull();
  });
});

@Pipe({
  // eslint-disable-next-line @angular-eslint/pipe-prefix
  name: 'translate',
  standalone: true,
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
