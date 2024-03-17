import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Community } from '../../../core/shared/community.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { DSOSelectorComponent } from '../../dso-selector/dso-selector/dso-selector.component';
import { createSuccessfulRemoteDataObject } from '../../remote-data.utils';
import { RouterStub } from '../../testing/router.stub';
import { ScopeSelectorModalComponent } from './scope-selector-modal.component';

describe('ScopeSelectorModalComponent', () => {
  let component: ScopeSelectorModalComponent;
  let fixture: ComponentFixture<ScopeSelectorModalComponent>;
  let debugElement: DebugElement;

  const community = new Community();
  community.uuid = '1234-1234-1234-1234';
  community.metadata = {
    'dc.title': [Object.assign(new MetadataValue(), {
      value: 'Community title',
      language: undefined,
    })],
  };
  const router = new RouterStub();
  const communityRD = createSuccessfulRemoteDataObject(community);
  const modalStub = jasmine.createSpyObj('modalStub', ['close']);

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ScopeSelectorModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              snapshot: {
                data: {
                  dso: communityRD,
                },
              },
            },
          },
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ScopeSelectorModalComponent, {
        remove: {
          imports: [DSOSelectorComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeSelectorModalComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
    spyOn(component.scopeChange, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router with the correct edit path when navigate is called', () => {
    component.navigate(community);
    expect(component.scopeChange.emit).toHaveBeenCalledWith(community);
  });

});
