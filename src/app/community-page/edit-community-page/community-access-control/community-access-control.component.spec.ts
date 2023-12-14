import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAccessControlComponent } from './community-access-control.component';
import {
  AccessControlFormContainerComponent
} from '../../../shared/access-control-form-container/access-control-form-container.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CommunityAccessControlComponent', () => {
  let component: CommunityAccessControlComponent;
  let fixture: ComponentFixture<CommunityAccessControlComponent>;
  let routeStub = {
    parent: {
      parent: {
        data: {
          pipe: () => {
            return {
              pipe: () => {
                return of({});
              }
            };
          }
        }
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CommunityAccessControlComponent],
    providers: [{
      provide: ActivatedRoute, useValue: routeStub
    }]
})
    .overrideComponent(CommunityAccessControlComponent, {
      remove: {
        imports: [AccessControlFormContainerComponent]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
