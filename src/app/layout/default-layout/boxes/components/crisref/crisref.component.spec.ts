import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisrefComponent } from './crisref.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { of } from 'rxjs';
import { Item } from '../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../core/layout/models/metadata-component.model';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';

describe('CrisrefComponent', () => {
  let component: CrisrefComponent;
  let fixture: ComponentFixture<CrisrefComponent>;
  let itemService: ItemDataService;

  const testPerson = Object.assign(new Item(), {
    id: '1',
    bundles: of({}),
    metadata: {
      'relationship.type': [
        {
          value: 'Person'
        }
      ],
      'person.orgunit.id': [
        {
          value: 'OrgUnit',
          authority: '2'
        }
      ]
    }
  });

  const testOrgunit = Object.assign(new Item(), {
    id: '2',
    bundles: of({}),
    metadata: {
      'relationship.type': [
        {
          value: 'OrgUnit'
        }
      ]
    }
  });

  const testField = Object.assign({
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'person.orgunit.id'
  }) as LayoutField;

  itemService = Object.assign( {
    findById: (id: string) => {
      if (id === '1') {
        return createSuccessfulRemoteDataObject$(testPerson);
      } else {
        return createSuccessfulRemoteDataObject$(testOrgunit)
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [ CrisrefComponent ],
      providers: [
        { provide: ItemDataService, useValue: itemService },
      ]
    })
    .compileComponents();
  }));

  describe('Check Orgunit icon', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CrisrefComponent);
      component = fixture.componentInstance;
      component.item = testPerson;
      component.field = testField;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should has orgunit icon', () => {
      const icon = fixture.debugElement.query(By.css('.fa-university'));

      expect(icon).toBeTruthy();
    });
  });

});
