import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccessControlFormContainerComponent } from '../../../shared/access-control-form-container/access-control-form-container.component';
import { ItemAccessControlComponent } from './item-access-control.component';

describe('ItemAccessControlComponent', () => {
  let component: ItemAccessControlComponent;
  let fixture: ComponentFixture<ItemAccessControlComponent>;
  let routeStub = {
    parent: {
      parent: {
        data: {
          pipe: () => {
            return {
              pipe: () => {
                return of({});
              },
            };
          },
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAccessControlComponent],
      providers: [{
        provide: ActivatedRoute, useValue: routeStub,
      }],
    })
      .overrideComponent(ItemAccessControlComponent, {
        remove: {
          imports: [AccessControlFormContainerComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
