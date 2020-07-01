import { Group } from '../../core/eperson/models/group.model';
import { EPersonMock } from './eperson.mock';

export const GroupMock2: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [],
    epersons: [],
    permanent: true,
    selfRegistered: false,
    _links: {
        self: {
            href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2',
        },
        subgroups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2/subgroups' },
        epersons: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid2/epersons' }
    },
    _name: 'testgroupname2',
    id: 'testgroupid2',
    uuid: 'testgroupid2',
    type: 'group',
});

export const GroupMock: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [GroupMock2],
    epersons: [EPersonMock],
    selfRegistered: false,
    permanent: false,
    _links: {
        self: {
            href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid',
        },
        subgroups: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/subgroups' },
        epersons: { href: 'https://dspace.4science.it/dspace-spring-rest/api/eperson/groups/testgroupid/epersons' }
    },
    _name: 'testgroupname',
    id: 'testgroupid',
    uuid: 'testgroupid',
    type: 'group',
});
