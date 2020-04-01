import { Group } from '../../core/eperson/models/group.model';

export const GroupMock: Group = Object.assign(new Group(), {
  handle: null,
  groups: [],
  selfRegistered: false,
  _links: {
    self: {
      href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid',
    },
    groups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/groups' }
  },
  id: 'testgroupid',
  uuid: 'testgroupid',
  type: 'group',
});
