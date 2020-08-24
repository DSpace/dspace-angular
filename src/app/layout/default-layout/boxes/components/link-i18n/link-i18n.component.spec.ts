import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { LinkI18nComponent } from './link-i18n.component';
import { Item } from 'src/app/core/shared/item.model';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Box } from 'src/app/core/layout/models/box.model';
import { TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('LinkI18nComponent', () => {
  let component: LinkI18nComponent;
  let fixture: ComponentFixture<LinkI18nComponent>;

  const testPublication = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.identifier.uri': [
        {
          value: 'http://rest.api/item/link/id'
        }
      ],
      'relationship.type': [
        {
          value: 'Publication'
        }
      ]
    }
  });

  const testProject = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.identifier.uri': [
        {
          value: 'http://rest.api/item/link/id'
        }
      ],
      'relationship.type': [
        {
          value: 'Project'
        }
      ]
    }
  });

  const testBoxPrimary = Object.assign(new Box(), {
    shortname: 'primary'
  });

  const testBoxDetails = Object.assign(new Box(), {
    shortname: 'details'
  });

  const testField = Object.assign({}, {
    id: 1,
    style: 'col-md-6',
    metadata: 'dc.identifier.uri'
  });

  const entityBoxLabel = 'Publication Primary Link';
  const entityLabel = 'Publication Link';
  const defaultLabel = 'link';

  const translateServiceInstace = Object.assign({
    get: (key: string) => {
      let label = key;
      if (key === 'layout.i18n.link.dc.identifier.uri.Publication.primary') {
        label = entityBoxLabel;
      } else if (key === 'layout.i18n.link.dc.identifier.uri.Publication') {
        label = entityLabel;
      } else if (key === 'layout.i18n.default') {
        label = defaultLabel;
      }
      return of(label);
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkI18nComponent ],
      providers: [
        { provide: TranslateService, useValue: translateServiceInstace }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    fixture = TestBed.createComponent(LinkI18nComponent);
    component = fixture.componentInstance;
    component.item = testPublication;
    component.field = testField;
    component.box = testBoxPrimary;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should has "' + entityBoxLabel + '" label', () => {
    fixture = TestBed.createComponent(LinkI18nComponent);
    component = fixture.componentInstance;
    component.item = testPublication;
    component.field = testField;
    component.box = testBoxPrimary;
    fixture.detectChanges();

    const valueContainer = fixture.debugElement.query(By.css('a'));
    const metadataValue = testPublication.firstMetadataValue( testField.metadata );
    expect(valueContainer.nativeElement.textContent.trim()).toContain(
      entityBoxLabel
    );
    expect(valueContainer.nativeElement.href).toContain(
      metadataValue
    );
  });

  it('should has "' + entityLabel + '" label', () => {
    fixture = TestBed.createComponent(LinkI18nComponent);
    component = fixture.componentInstance;
    component.item = testPublication;
    component.field = testField;
    component.box = testBoxDetails;
    fixture.detectChanges();

    const valueContainer = fixture.debugElement.query(By.css('a'));
    const metadataValue = testPublication.firstMetadataValue( testField.metadata );
    expect(valueContainer.nativeElement.textContent.trim()).toContain(
      entityLabel
    );
    expect(valueContainer.nativeElement.href).toContain(
      metadataValue
    );
  });

  it('should has "' + defaultLabel + '" label (default)', () => {
    fixture = TestBed.createComponent(LinkI18nComponent);
    component = fixture.componentInstance;
    component.item = testProject;
    component.field = testField;
    component.box = testBoxDetails;
    fixture.detectChanges();

    const valueContainer = fixture.debugElement.query(By.css('a'));
    const metadataValue = testPublication.firstMetadataValue( testField.metadata );
    expect(valueContainer.nativeElement.textContent.trim()).toContain(
      defaultLabel
    );
    expect(valueContainer.nativeElement.href).toContain(
      metadataValue
    );
  });
});
