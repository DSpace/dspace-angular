import { RegistrationResolver } from './registration.resolver';
import { EpersonRegistrationService } from '../core/data/eperson-registration.service';
import { of as observableOf } from 'rxjs';
import { Registration } from '../core/shared/registration.model';
import { first } from 'rxjs/operators';

describe('RegistrationResolver', () => {
  let resolver: RegistrationResolver;
  let epersonRegistrationService: EpersonRegistrationService;

  const token = 'test-token';
  const registration = Object.assign(new Registration(), {email: 'test@email.org', token: token, user:'user-uuid'});

  beforeEach(() => {
    epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
      searchByToken: observableOf(registration)
    });
    resolver = new RegistrationResolver(epersonRegistrationService);
  });
  describe('resolve', () => {
    it('should resolve a registration based on the token', () => {
      resolver.resolve({params: {token: token}} as any, undefined)
        .pipe(first())
        .subscribe(
          (resolved) => {
            expect(resolved.token).toEqual(token);
            expect(resolved.email).toEqual('test@email.org');
            expect(resolved.user).toEqual('user-uuid');
          }
        );
    });
  });
});
