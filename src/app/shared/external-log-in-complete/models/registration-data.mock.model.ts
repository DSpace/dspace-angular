import { AuthMethodType } from 'src/app/core/auth/models/auth.method-type';
import { RegistrationData } from './registration-data.model';
import { MetadataValue } from '../../../core/shared/metadata.models';

export const mockRegistrationDataModel: RegistrationData = Object.assign(
  new RegistrationData(),
  {
    id: '3',
    email: 'user@institution.edu',
    user: '028dcbb8-0da2-4122-a0ea-254be49ca107',
    registrationType: AuthMethodType.Orcid,
    netId: '0000-1111-2222-3333',
    registrationMetadata: {
      'eperson.firstname': [
        Object.assign(new MetadataValue(), {
          value: 'User 1',
          language: null,
          authority: '',
          confidence: -1,
          place: -1,
        }),
      ],
      'eperson.lastname': [
        Object.assign(new MetadataValue(), {
          value: 'Power',
          language: null,
          authority: '',
          confidence: -1,
          place: -1,
        }),
      ],
      'email': [
        {
          value: 'power-user@orcid.org',
          language: null,
          authority: '',
          confidence: -1,
          place: -1,
          overrides: 'power-user@dspace.org',
        },
      ],
    },
  }
);
