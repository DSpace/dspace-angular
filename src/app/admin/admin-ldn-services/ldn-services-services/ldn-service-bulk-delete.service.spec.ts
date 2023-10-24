import { TestBed } from '@angular/core/testing';

import { LdnServicesBulkDeleteService } from './ldn-service-bulk-delete.service';

describe('LdnServiceBulkDeleteService', () => {
    let service: LdnServicesBulkDeleteService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LdnServicesBulkDeleteService);
    });

    it('should be created', () => {
        // @ts-ignore
        expect(service).toBeTruthy();
    });
});
