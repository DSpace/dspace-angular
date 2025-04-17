export enum AuthMethodType {
  Password = 'password',
  Shibboleth = 'shibboleth',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  Ldap = 'password',
  Ip = 'ip',
  X509 = 'x509',
  Oidc = 'oidc',
  Orcid = 'orcid',
}
