import { first } from 'rxjs/operators';

import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { Registration } from '../core/shared/registration.model';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { registrationResolver } from './registration.resolver';

describe('registrationResolver', () => {
  let resolver: any;
  let epersonRegistrationService: EpersonRegistrationService;

  const token = 'test-token';
  const registration = Object.assign(new Registration(), { email: 'test@email.org', token: token, user:'user-uuid' });

  beforeEach(() => {
    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      searchByToken: createSuccessfulRemoteDataObject$(registration),
    });
    resolver = registrationResolver;
  });
  describe('resolve', () => {
    it('should resolve a registration based on the token', (done) => {
      resolver({ params: { token: token } } as any, undefined, epersonRegistrationService)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.payload.token).toEqual(token);
            expect(resolved.payload.email).toEqual('test@email.org');
            expect(resolved.payload.user).toEqual('user-uuid');
            done();
          },
        );
    });
  });
});
