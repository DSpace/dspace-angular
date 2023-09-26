import { AuthMethodType } from 'src/app/core/auth/models/auth.method-type';
import { RegistrationData } from './registration-data.model';
import { MetadataValue } from '../../../core/shared/metadata.models';

export const mockRegistrationDataModel: RegistrationData = Object.assign( new RegistrationData(), {
  id: '3',
  email: 'user@institution.edu',
  user: '028dcbb8-0da2-4122-a0ea-254be49ca107',
  registrationType: AuthMethodType.Orcid,
  netId: '<:orcid>',
  registrationMetadata: {
    'eperson.firstname': [
      Object.assign(new MetadataValue(), {
        value: 'User',
        language: null,
        authority: '',
        confidence: -1,
        place: -1,
      })
    ],
    'eperson.lastname': [
      Object.assign(new MetadataValue(), {
        value: 'Power',
        language: null,
        authority: '',
        confidence: -1,
        place: -1
      })
    ]
  }
});
