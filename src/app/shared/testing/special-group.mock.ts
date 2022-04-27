import { EPersonMock } from './eperson.mock';
import { of } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { environment } from '../../../environments/environment';
import { RequestEntryState } from '../../core/data/request.reducer';
import { PageInfo } from '../../core/shared/page-info.model';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { Group } from '../../core/eperson/models/group.model';


export const SpecialGroupMock2: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [],
    epersons: [],
    permanent: true,
    selfRegistered: false,
    _links: {
        self: {
            href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid2',
        },
        subgroups: { href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid2/subgroups' },
        object: { href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid2/object' },
        epersons: { href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid2/epersons' }
    },
    _name: 'testgroupname2',
    id: 'testgroupid2',
    uuid: 'testgroupid2',
    type: 'specialGroups',
   // object: createSuccessfulRemoteDataObject$({ name: 'testspecialGroupsid2objectName'})
});

export const SpecialGroupMock: Group = Object.assign(new Group(), {
    handle: null,
    subgroups: [SpecialGroupMock2],
    epersons: [EPersonMock],
    selfRegistered: false,
    permanent: false,
    _links: {
        self: {
            href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid',
        },
        subgroups: { href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid/subgroups' },
        object: { href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid2/object' },
        epersons: { href: 'https://rest.api/server/api/eperson/specialGroups/testgroupid/epersons' }
    },
    _name: 'testgroupname',
    id: 'testgroupid',
    uuid: 'testgroupid',
    type: 'specialGroups',
});

export const SpecialGroupData = of(new RemoteData(
    new Date().getTime(),
    environment.cache.msToLive.default,
    new Date().getTime(),
    RequestEntryState.Success,
    undefined,
    buildPaginatedList(new PageInfo(), [SpecialGroupMock2,SpecialGroupMock]),
    200
  ));

  


