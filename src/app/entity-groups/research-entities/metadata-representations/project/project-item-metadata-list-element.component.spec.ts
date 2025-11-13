import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { ItemMetadataRepresentation } from '@dspace/core/shared/metadata-representation/item/item-metadata-representation.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TruncatableComponent } from '../../../../shared/truncatable/truncatable.component';
import { ProjectItemMetadataListElementComponent } from './project-item-metadata-list-element.component';

const projectTitle = 'Lorem ipsum dolor sit amet';
const mockItem = Object.assign(new Item(), { metadata: { 'dc.title': [{ value: projectTitle }] } });
const virtMD = Object.assign(new MetadataValue(), { value: projectTitle });

const mockItemMetadataRepresentation = Object.assign(new ItemMetadataRepresentation(virtMD), mockItem);

describe('ProjectItemMetadataListElementComponent', () => {
  let comp: ProjectItemMetadataListElementComponent;
  let fixture: ComponentFixture<ProjectItemMetadataListElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule,
        ProjectItemMetadataListElementComponent,
      ],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ProjectItemMetadataListElementComponent, {
      remove: {
        imports: [TruncatableComponent, RouterLink],
      },
      add: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectItemMetadataListElementComponent);
    comp = fixture.componentInstance;
    comp.mdRepresentation = mockItemMetadataRepresentation;
    fixture.detectChanges();
  });

  it('should show the project\'s name as a link', () => {
    const linkText = fixture.debugElement.query(By.css('a')).nativeElement.textContent;
    expect(linkText).toBe(projectTitle);
  });

});
