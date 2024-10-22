import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchColor, SwitchComponent, SwitchOption } from './switch.component';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;
  const mockOptions: SwitchOption[] = [
    { value: 1, icon: 'icon-1', label: 'Option 1', backgroundColor: SwitchColor.Success, iconColor: SwitchColor.Primary, labelColor: SwitchColor.Primary  },
    { value: 2, icon: 'icon-2', label: 'Option 2', backgroundColor: SwitchColor.Danger, iconColor: SwitchColor.Warning, labelColor: SwitchColor.Success  },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all switch options', () => {
    component.options = mockOptions;
    fixture.detectChanges();

    const optionElements = fixture.debugElement.queryAll(By.css('.switch-opt'));
    expect(optionElements.length).toBe(mockOptions.length);
  });

  it('should select an option and emit selected value', () => {
    component.options = mockOptions;
    component.onOptionClick(mockOptions[0].value);
    fixture.detectChanges();

    spyOn(component.selectedValueChange, 'emit');

    const secondOption = fixture.debugElement.queryAll(By.css('.switch-opt'))[1];
    secondOption.triggerEventHandler('click');
    fixture.detectChanges();

    expect(component.selectedValue).toBe(mockOptions[1].value);
    expect(component.selectedValueChange.emit).toHaveBeenCalledWith(mockOptions[1].value);
  });

  it('should apply the correct background color class', () => {
    component.options = mockOptions;
    component.onOptionClick(mockOptions[1].value);
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(By.css('.switch-container'));
    expect(containerElement.classes['bg-danger']).toBeTruthy();
  });

  it('should apply the correct icon color class for selected option', () => {
    component.options = mockOptions;
    component.onOptionClick(mockOptions[1].value);
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.switch-opt .icon-2'));
    expect(iconElement.classes['text-warning']).toBeTruthy();
  });

  it('should display the correct label with the selected color', () => {
    component.options = mockOptions;
    component.onOptionClick(mockOptions[1].value);
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.visibility-label'));
    expect(labelElement.nativeElement.textContent.trim()).toBe('Option 2');
    expect(labelElement.classes['text-success']).toBeTruthy();
  });

  it('should apply bg-white class to selected option', () => {
    component.options = mockOptions;
    component.onOptionClick(mockOptions[1].value);
    fixture.detectChanges();

    const selectedOptionElement = fixture.debugElement.query(By.css('.switch-opt.bg-white'));
    expect(selectedOptionElement).toBeTruthy();
  });

});
