import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ClaimedTaskActionsEditMetadataComponent } from './claimed-task-actions-edit-metadata.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';

let component: ClaimedTaskActionsEditMetadataComponent;
let fixture: ComponentFixture<ClaimedTaskActionsEditMetadataComponent>;

describe('ClaimedTaskActionsEditMetadataComponent', () => {
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [ClaimedTaskActionsEditMetadataComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ClaimedTaskActionsEditMetadataComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsEditMetadataComponent);
    component = fixture.componentInstance;
    component.object = object;
    fixture.detectChanges();
  });

  it('should display edit button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-primary'));

    expect(btn).toBeDefined();
  });

});
