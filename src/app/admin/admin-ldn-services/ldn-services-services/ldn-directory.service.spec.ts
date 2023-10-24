import { TestBed } from '@angular/core/testing';

import { LdnDirectoryService } from './ldn-directory.service';

describe('LdnDirectoryService', () => {
    let service: LdnDirectoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LdnDirectoryService);
    });

    it('should be created', () => {
        // @ts-ignore
        expect(service).toBeTruthy();
    });
});
