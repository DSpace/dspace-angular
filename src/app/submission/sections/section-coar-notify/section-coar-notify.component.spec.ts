import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionSectionCoarNotifyComponent } from './section-coar-notify.component';
import { LdnServicesService } from '../../../admin/admin-ldn-services/ldn-services-data/ldn-services-data.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionsService } from '../sections.service';
import { CoarNotifyConfigDataService } from './coar-notify-config-data.service';
import { ChangeDetectorRef } from '@angular/core';
import { SubmissionCoarNotifyConfig } from './submission-coar-notify.config';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { of } from 'rxjs';
import { LdnService } from '../../../admin/admin-ldn-services/ldn-services-model/ldn-services.model';
import { NotifyServicePattern } from '../../../admin/admin-ldn-services/ldn-services-model/ldn-service-patterns.model';

describe('SubmissionSectionCoarNotifyComponent', () => {
  let component: SubmissionSectionCoarNotifyComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionCoarNotifyComponent>;

  let ldnServicesService: jasmine.SpyObj<LdnServicesService>;
  let coarNotifyConfigDataService: jasmine.SpyObj<CoarNotifyConfigDataService>;
  let operationsBuilder: jasmine.SpyObj<JsonPatchOperationsBuilder>;
  let sectionService: jasmine.SpyObj<SectionsService>;
  let cdRefStub: any;

  const patterns: SubmissionCoarNotifyConfig[] = Object.assign(
    [new SubmissionCoarNotifyConfig()],
    {
      patterns: ['review', 'endorsment'],
    }
  );
  const patternsPL = createPaginatedList(patterns);
  const coarNotifyConfig = createSuccessfulRemoteDataObject$(patternsPL);

  beforeEach(async () => {
    ldnServicesService = jasmine.createSpyObj('LdnServicesService', [
      'findByInboundPattern',
    ]);
    coarNotifyConfigDataService = jasmine.createSpyObj(
      'CoarNotifyConfigDataService',
      ['findAll']
    );
    operationsBuilder = jasmine.createSpyObj('JsonPatchOperationsBuilder', [
      'remove',
      'replace',
      'add',
    ]);
    sectionService = jasmine.createSpyObj('SectionsService', [
      'dispatchRemoveSectionErrors',
      'getSectionServerErrors',
      'setSectionError',
    ]);
    cdRefStub = Object.assign({
      detectChanges: () => fixture.detectChanges(),
    });

    await TestBed.configureTestingModule({
      declarations: [SubmissionSectionCoarNotifyComponent],
      providers: [
        { provide: LdnServicesService, useValue: ldnServicesService },
        { provide: CoarNotifyConfigDataService, useValue: coarNotifyConfigDataService},
        { provide: JsonPatchOperationsBuilder, useValue: operationsBuilder },
        { provide: SectionsService, useValue: sectionService },
        { provide: ChangeDetectorRef, useValue: cdRefStub },
        { provide: 'collectionIdProvider', useValue: 'collectionId' },
        { provide: 'sectionDataProvider', useValue: { id: 'sectionId', data: {} }},
        { provide: 'submissionIdProvider', useValue: 'submissionId' },
        NgbDropdown,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmissionSectionCoarNotifyComponent);
    component = fixture.componentInstance;
    componentAsAny = component;

    component.patterns = patterns[0].patterns;
    coarNotifyConfigDataService.findAll.and.returnValue(coarNotifyConfig);
    sectionService.getSectionServerErrors.and.returnValue(
      of(
        Object.assign([], {
          path: 'sections/sectionId/data/notifyCoar',
          message: 'error',
        })
      )
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSectionInit', () => {
    it('should call setCoarNotifyConfig and getSectionServerErrorsAndSetErrorsToDisplay', () => {
      spyOn(component, 'setCoarNotifyConfig');
      spyOn(componentAsAny, 'getSectionServerErrorsAndSetErrorsToDisplay');

      component.onSectionInit();

      expect(component.setCoarNotifyConfig).toHaveBeenCalled();
      expect(componentAsAny.getSectionServerErrorsAndSetErrorsToDisplay).toHaveBeenCalled();
    });
  });

  describe('onChange', () => {
    const pattern = 'review';
    const index = 0;
    const selectedService: LdnService = Object.assign(new LdnService(), {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [
        {
          pattern: 'review',
        },
      ],
      description: '',
    });

    beforeEach(() => {
      component.ldnServiceByPattern[pattern] = [];
    });

    it('should do nothing if the selected value is the same as the previous one', () => {
      component.ldnServiceByPattern[pattern][index] = selectedService;
      component.onChange(pattern, index, selectedService);

      expect(componentAsAny.operationsBuilder.remove).not.toHaveBeenCalled();
      expect(componentAsAny.operationsBuilder.replace).not.toHaveBeenCalled();
      expect(componentAsAny.operationsBuilder.add).not.toHaveBeenCalled();
    });

    it('should remove the path when the selected value is null', () => {
      component.ldnServiceByPattern[pattern][index] = selectedService;
      component.onChange(pattern, index, null);

      expect(componentAsAny.operationsBuilder.remove).toHaveBeenCalledWith(
        componentAsAny.pathCombiner.getPath([pattern, index.toString()])
      );
      expect(component.ldnServiceByPattern[pattern][index]).toBeNull();
      expect(component.previousServices[pattern][index]).toBeNull();
    });

    it('should replace the path when there is a previous value stored and it is different from the new one', () => {
      const previousService: LdnService = Object.assign(new LdnService(), {
        id: 2,
        name: 'service2',
        notifyServiceInboundPatterns: [
          {
            pattern: 'endorsement',
          },
        ],
        description: 'test',
      });
      component.ldnServiceByPattern[pattern][index] = previousService;
      component.previousServices[pattern] = [];
      component.previousServices[pattern][index] = previousService.id;
      component.onChange(pattern, index, selectedService);

      expect(componentAsAny.operationsBuilder.replace).toHaveBeenCalledWith(
        componentAsAny.pathCombiner.getPath([pattern, index.toString()]),
        selectedService.id,
        true
      );
      expect(component.ldnServiceByPattern[pattern][index]).toEqual(
        selectedService
      );
      expect(component.previousServices[pattern][index]).toEqual(
        selectedService.id
      );
    });

    it('should add the path when there is no previous value stored', () => {
      component.onChange(pattern, index, selectedService);

      expect(componentAsAny.operationsBuilder.add).toHaveBeenCalledWith(
        componentAsAny.pathCombiner.getPath([pattern, '-']),
        [selectedService.id],
        false,
        true
      );
      expect(component.ldnServiceByPattern[pattern][index]).toEqual(
        selectedService
      );
      expect(component.previousServices[pattern][index]).toEqual(
        selectedService.id
      );
    });
  });

  describe('initSelectedServicesByPattern', () => {
    const pattern1 = 'review';
    const pattern2 = 'endorsement';
    const service1: LdnService = Object.assign(new LdnService(), {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [
        Object.assign(new NotifyServicePattern(), {
          pattern: pattern1,
        }),
      ],
    });
    const service2: LdnService = Object.assign(new LdnService(), {
      id: 2,
      name: 'service2',
      notifyServiceInboundPatterns: [
        Object.assign(new NotifyServicePattern(), {
          pattern: pattern2,
        }),
      ],
    });
    const service3: LdnService = Object.assign(new LdnService(), {
      id: 3,
      name: 'service3',
      notifyServiceInboundPatterns: [
        Object.assign(new NotifyServicePattern(), {
          pattern: pattern1,
        }),
        Object.assign(new NotifyServicePattern(), {
          pattern: pattern2,
        }),
      ],
    });

    const services = [service1, service2, service3];

    beforeEach(() => {
      spyOn(component, 'filterServices').and.callFake((pattern) => {
        return of(
          services.filter((service) =>
            component.hasInboundPattern(service, pattern)
          )
        );
      });
    });

    it('should initialize the selected services by pattern', () => {
      component.patterns = [pattern1, pattern2];
      component.initSelectedServicesByPattern();

      expect(component.ldnServiceByPattern[pattern1]).toEqual([null]);
      expect(component.ldnServiceByPattern[pattern2]).toEqual([null]);
    });

    it('should add the service to the selected services by pattern if the section data has a value for the pattern', () => {
      component.patterns = [pattern1, pattern2];
      component.sectionData.data[pattern1] = [service1.id, service3.id];
      component.sectionData.data[pattern2] = [service2.id, service3.id];
      component.initSelectedServicesByPattern();

      expect(component.ldnServiceByPattern[pattern1]).toEqual([
        service1,
        service3,
      ]);
      expect(component.ldnServiceByPattern[pattern2]).toEqual([
        service2,
        service3,
      ]);
    });
  });

  describe('addService', () => {
    const pattern = 'review';
    const service: any = {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [{ pattern: pattern }],
    };

    beforeEach(() => {
      component.ldnServiceByPattern[pattern] = [];
    });

    it('should push the new service to the array corresponding to the pattern', () => {
      component.addService(pattern, service);

      expect(component.ldnServiceByPattern[pattern]).toEqual([service]);
    });
  });

  describe('removeService', () => {
    const pattern = 'review';
    const service1: LdnService = Object.assign(new LdnService(), {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [
        Object.assign(new NotifyServicePattern(), {
          pattern: pattern,
        }),
      ],
    });
    const service2: LdnService = Object.assign(new LdnService(), {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [
        Object.assign(new NotifyServicePattern(), {
          pattern: pattern,
        }),
      ],
    });
    const service3: LdnService = Object.assign(new LdnService(), {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [
        Object.assign(new NotifyServicePattern(), {
          pattern: pattern,
        }),
      ],
    });

    beforeEach(() => {
      component.ldnServiceByPattern[pattern] = [service1, service2, service3];
    });

    it('should remove the service at the specified index from the array corresponding to the pattern', () => {
      component.removeService(pattern, 1);

      expect(component.ldnServiceByPattern[pattern]).toEqual([
        service1,
        service3,
      ]);
    });
  });

  describe('filterServices', () => {
    const pattern = 'review';
    const service1: any = {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [{ pattern: pattern }],
    };
    const service2: any = {
      id: 2,
      name: 'service2',
      notifyServiceInboundPatterns: [{ pattern: pattern }],
    };
    const service3: any = {
      id: 3,
      name: 'service3',
      notifyServiceInboundPatterns: [{ pattern: pattern }],
    };
    const services = [service1, service2, service3];

    beforeEach(() => {
      ldnServicesService.findByInboundPattern.and.returnValue(
        createSuccessfulRemoteDataObject$(createPaginatedList(services))
      );
    });

    it('should return an observable of the services that match the given pattern', () => {
      component.filterServices(pattern).subscribe((result) => {
        expect(result).toEqual(services);
      });
    });
  });

  describe('hasInboundPattern', () => {
    const pattern = 'review';
    const service: any = {
      id: 1,
      name: 'service1',
      notifyServiceInboundPatterns: [{ pattern: pattern }],
    };

    it('should return true if the service has the specified inbound pattern type', () => {
      expect(component.hasInboundPattern(service, pattern)).toBeTrue();
    });

    it('should return false if the service does not have the specified inbound pattern type', () => {
      expect(component.hasInboundPattern(service, 'endorsement')).toBeFalse();
    });
  });

  describe('getSectionServerErrorsAndSetErrorsToDisplay', () => {
    it('should set the validation errors for the current section to display', () => {
      const validationErrors = [
        { path: 'sections/sectionId/data/notifyCoar', message: 'error' },
      ];
      sectionService.getSectionServerErrors.and.returnValue(
        of(validationErrors)
      );

      componentAsAny.getSectionServerErrorsAndSetErrorsToDisplay();

      expect(sectionService.setSectionError).toHaveBeenCalledWith(
        component.submissionId,
        component.sectionData.id,
        validationErrors[0]
      );
    });
  });

  describe('onSectionDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      const sub1 = of(null).subscribe();
      const sub2 = of(null).subscribe();
      componentAsAny.subs = [sub1, sub2];
      spyOn(sub1, 'unsubscribe');
      spyOn(sub2, 'unsubscribe');
      component.onSectionDestroy();
      expect(sub1.unsubscribe).toHaveBeenCalled();
      expect(sub2.unsubscribe).toHaveBeenCalled();
    });
  });
});
