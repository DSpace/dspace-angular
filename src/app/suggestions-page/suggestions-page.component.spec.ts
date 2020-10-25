import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { OpenaireModule } from '../openaire/openaire.module';

describe('SuggestionPageComponent', () => {
  let component: SuggestionsPageComponent;
  let fixture: ComponentFixture<SuggestionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OpenaireModule
      ],
      declarations: [ SuggestionsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
