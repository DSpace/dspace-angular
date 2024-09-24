import { AuthMethodType } from '../../core/auth/models/auth.method-type';
import { MetadataValue } from '../../core/shared/metadata.models';
import { Registration } from '../../core/shared/registration.model';

export const mockRegistrationDataModel: Registration = Object.assign(
  new Registration(),
  {
    id: '3',
    email: 'user@institution.edu',
    user: '028dcbb8-0da2-4122-a0ea-254be49ca107',
    registrationType: AuthMethodType.Orcid,
    netId: '0000-1111-2222-3333',
    registrationMetadata: {
      'eperson.firstname': [
        Object.assign(new MetadataValue(), {
          value: 'User',
          language: null,
          authority: '',
          confidence: -1,
          place: -1,
          overrides: 'User',
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
  },
);
