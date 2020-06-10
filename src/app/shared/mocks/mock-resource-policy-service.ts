import { ResourcePolicyService } from '../../core/resource-policy/resource-policy.service';

export function getMockResourcePolicyService(): ResourcePolicyService {
  return jasmine.createSpyObj('resourcePolicyService', {
    searchByResource: jasmine.createSpy('searchByResource'),
    create: jasmine.createSpy('create'),
    delete: jasmine.createSpy('delete'),
    update: jasmine.createSpy('update')
  });
}
