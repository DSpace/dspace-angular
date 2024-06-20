import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarinDateItemFieldComponent } from './clarin-date-item-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { Item } from '../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { ClarinDateService } from '../../../../shared/clarin-date.service';

describe('ClarinDateItemFieldComponent', () => {
  let component: ClarinDateItemFieldComponent;
  let fixture: ComponentFixture<ClarinDateItemFieldComponent>;
  let clarinDateService: ClarinDateService;

  const mockItem: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: {
      'dc.identifier.uri': [
        {
          language: 'en_US',
          value: 'some handle'
        }
      ]
    }
  });

  beforeEach(async () => {
    clarinDateService = jasmine.createSpyObj('clarinDateService', {
      composeItemDate: '2020-01-01' });

    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot() ],
      declarations: [ ClarinDateItemFieldComponent ],
      providers: [
        { provide: ClarinDateService, useValue: clarinDateService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClarinDateItemFieldComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
