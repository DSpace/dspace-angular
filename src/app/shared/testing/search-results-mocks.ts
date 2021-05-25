export const SearchResultsMock: any = {
  'timeCompleted': 1619471782630,
  'msToLive': 900000,
  'lastUpdated': 1619471782630,
  'state': 'Success',
  'errorMessage': null,
  'payload': {
    'type': {
      'value': 'discovery-objects'
    },
    'page': [
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': 241,
            'errors': [
              {
                'message': 'error.validation.required',
                'paths': [
                  '/sections/publication/dc.type'
                ]
              }
            ],
            'lastModified': '2021-04-26T21:16:19.928+0000',
            'sections': {
              'license': {
                'url': null,
                'acceptanceDate': null,
                'granted': false
              },
              'publication_references': {},
              'upload': {
                'files': [
                  {
                    'uuid': '098d9791-b464-4a11-9c8f-95971d300c05',
                    'metadata': {
                      'dc.source': [
                        {
                          'value': 'cerif-frbr.pdf',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'cerif-frbr.pdf',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ]
                    },
                    'accessConditions': [],
                    'format': {
                      'id': 4,
                      'shortDescription': 'Adobe PDF',
                      'description': 'Adobe Portable Document Format',
                      'mimetype': 'application/pdf',
                      'supportLevel': 'KNOWN',
                      'internal': false,
                      'extensions': [
                        'pdf'
                      ],
                      'type': 'bitstreamformat'
                    },
                    'sizeBytes': 1537579,
                    'checkSum': {
                      'checkSumAlgorithm': 'MD5',
                      'value': 'abdc75986daae51f0876b8be2351c309'
                    },
                    'url': 'https://dspacecris7.4science.cloud/server/api/core/bitstreams/098d9791-b464-4a11-9c8f-95971d300c05/content'
                  }
                ]
              },
              'publication': {
                'dc.contributor.author': [
                  {
                    'value': 'Dvořák, Jan',
                    'language': null,
                    'authority': null,
                    'confidence': 400,
                    'place': 0
                  },
                  {
                    'value': 'Drobíková, Barbora',
                    'language': null,
                    'authority': null,
                    'confidence': 400,
                    'place': 1
                  },
                  {
                    'value': 'Bollini, Andrea',
                    'language': null,
                    'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'confidence': 400,
                    'place': 2
                  }
                ],
                'dc.title': [
                  {
                    'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ],
                'oairecerif.author.affiliation': [
                  {
                    'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  },
                  {
                    'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 1
                  },
                  {
                    'value': '4Science',
                    'language': null,
                    'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                    'confidence': 600,
                    'place': 2
                  }
                ],
                'dc.date.issued': [
                  {
                    'value': '2006',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ]
              },
              'publication_indexing': {
                'dc.description.abstract': [
                  {
                    'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ],
                'dc.subject': [
                  {
                    'value': 'CRIS',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  },
                  {
                    'value': 'interoperability',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 1
                  },
                  {
                    'value': 'CERIF',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 2
                  },
                  {
                    'value': 'functions of scientific communication',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 3
                  },
                  {
                    'value': 'publication metadata',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 4
                  },
                  {
                    'value': 'FRBR',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 5
                  },
                  {
                    'value': 'SWAP',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 6
                  },
                  {
                    'value': 'scholarly work',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 7
                  },
                  {
                    'value': 'expression',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 8
                  },
                  {
                    'value': 'manifestation',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 9
                  },
                  {
                    'value': 'research evaluation',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 10
                  }
                ]
              },
              'detect-duplicate': {
                'matches': {
                  '6e63adab-a02d-4722-a079-e1a8779cab3a': {
                    'submitterDecision': null,
                    'workflowDecision': null,
                    'adminDecision': null,
                    'submitterNote': null,
                    'workflowNote': null,
                    'matchObject': {
                      'id': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                      'uuid': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                      'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'handle': null,
                      'metadata': {
                        'dc.contributor.author': [
                          {
                            'value': 'Dvořák, Jan',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 0
                          },
                          {
                            'value': 'Drobíková, Barbora',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 1
                          },
                          {
                            'value': 'Bollini, Andrea',
                            'language': null,
                            'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                            'confidence': 400,
                            'place': 2
                          }
                        ],
                        'dc.description.abstract': [
                          {
                            'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.identifier': [
                          {
                            'value': '10.1016/j.procs.2014.06.008',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.subject': [
                          {
                            'value': 'CRIS',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': 'interoperability',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': 'CERIF',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 2
                          },
                          {
                            'value': 'functions of scientific communication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 3
                          },
                          {
                            'value': 'publication metadata',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 4
                          },
                          {
                            'value': 'FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 5
                          },
                          {
                            'value': 'SWAP',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 6
                          },
                          {
                            'value': 'scholarly work',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 7
                          },
                          {
                            'value': 'expression',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 8
                          },
                          {
                            'value': 'manifestation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 9
                          },
                          {
                            'value': 'research evaluation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 10
                          }
                        ],
                        'dc.title': [
                          {
                            'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dspace.entity.type': [
                          {
                            'value': 'Publication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ]
                      },
                      'inArchive': false,
                      'discoverable': true,
                      'withdrawn': false,
                      'lastModified': '2021-04-16T11:03:11.014+0000',
                      'entityType': 'Publication',
                      'type': 'item'
                    }
                  },
                  'eb4762fa-1046-443f-8f29-5e2c907c3c78': {
                    'submitterDecision': null,
                    'workflowDecision': null,
                    'adminDecision': null,
                    'submitterNote': null,
                    'workflowNote': null,
                    'matchObject': {
                      'id': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                      'uuid': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                      'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'handle': null,
                      'metadata': {
                        'dc.contributor.author': [
                          {
                            'value': 'Dvořák, Jan',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 0
                          },
                          {
                            'value': 'Drobíková, Barbora',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 1
                          },
                          {
                            'value': 'Bollini, Andrea',
                            'language': null,
                            'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                            'confidence': 400,
                            'place': 2
                          }
                        ],
                        'dc.description.abstract': [
                          {
                            'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.identifier': [
                          {
                            'value': '10.1016/j.procs.2014.06.008',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.subject': [
                          {
                            'value': 'CRIS',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': 'interoperability',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': 'CERIF',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 2
                          },
                          {
                            'value': 'functions of scientific communication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 3
                          },
                          {
                            'value': 'publication metadata',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 4
                          },
                          {
                            'value': 'FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 5
                          },
                          {
                            'value': 'SWAP',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 6
                          },
                          {
                            'value': 'scholarly work',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 7
                          },
                          {
                            'value': 'expression',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 8
                          },
                          {
                            'value': 'manifestation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 9
                          },
                          {
                            'value': 'research evaluation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 10
                          }
                        ],
                        'dc.title': [
                          {
                            'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dspace.entity.type': [
                          {
                            'value': 'Publication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ]
                      },
                      'inArchive': false,
                      'discoverable': true,
                      'withdrawn': false,
                      'lastModified': '2021-04-15T21:48:03.591+0000',
                      'entityType': 'Publication',
                      'type': 'item'
                    }
                  }
                }
              },
              'collection': '8bb47238-2964-4d9f-be56-e912bf17ac58',
              'publication_bibliographic_details': {}
            },
            'type': 'workspaceitem',
            '_links': {
              'collection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/collection'
              },
              'item': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/item'
              },
              'submissionDefinition': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/submissionDefinition'
              },
              'submitter': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/submitter'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241'
              }
            },
            '_embedded': {
              'submitter': {
                'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'name': 'dspacedemo+admin@gmail.com',
                'handle': null,
                'metadata': {
                  'dspace.agreements.cookies': [
                    {
                      'value': '{"authentication":true,"preferences":true,"acknowledgement":true,"google-analytics":true}',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.agreements.end-user': [
                    {
                      'value': 'true',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.firstname': [
                    {
                      'value': 'Demo',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.lastname': [
                    {
                      'value': 'Site Administrator',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'netid': null,
                'lastActive': '2021-04-26T21:14:19.119+0000',
                'canLogIn': true,
                'email': 'dspacedemo+admin@gmail.com',
                'requireCertificate': false,
                'selfRegistered': false,
                'type': 'eperson',
                '_links': {
                  'groups': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda/groups'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda'
                  }
                }
              },
              'item': {
                'id': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                'uuid': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                'handle': null,
                'metadata': {
                  'dc.contributor.author': [
                    {
                      'value': 'Dvořák, Jan',
                      'language': null,
                      'authority': null,
                      'confidence': 400,
                      'place': 0
                    },
                    {
                      'value': 'Drobíková, Barbora',
                      'language': null,
                      'authority': null,
                      'confidence': 400,
                      'place': 1
                    },
                    {
                      'value': 'Bollini, Andrea',
                      'language': null,
                      'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                      'confidence': 400,
                      'place': 2
                    }
                  ],
                  'dc.date.issued': [
                    {
                      'value': '2006',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.description.abstract': [
                    {
                      'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.identifier': [
                    {
                      'value': '10.1016/j.procs.2014.06.008',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.subject': [
                    {
                      'value': 'CRIS',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    },
                    {
                      'value': 'interoperability',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 1
                    },
                    {
                      'value': 'CERIF',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 2
                    },
                    {
                      'value': 'functions of scientific communication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 3
                    },
                    {
                      'value': 'publication metadata',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 4
                    },
                    {
                      'value': 'FRBR',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 5
                    },
                    {
                      'value': 'SWAP',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 6
                    },
                    {
                      'value': 'scholarly work',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 7
                    },
                    {
                      'value': 'expression',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 8
                    },
                    {
                      'value': 'manifestation',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 9
                    },
                    {
                      'value': 'research evaluation',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 10
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'oairecerif.author.affiliation': [
                    {
                      'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    },
                    {
                      'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 1
                    },
                    {
                      'value': '4Science',
                      'language': null,
                      'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                      'confidence': 600,
                      'place': 2
                    }
                  ]
                },
                'inArchive': false,
                'discoverable': true,
                'withdrawn': false,
                'lastModified': '2020-12-07T10:10:11.248+0000',
                'entityType': 'Publication',
                'type': 'item',
                '_links': {
                  'bundles': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/bundles'
                  },
                  'mappedCollections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/mappedCollections'
                  },
                  'owningCollection': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/owningCollection'
                  },
                  'relationships': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/relationships'
                  },
                  'version': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/version'
                  },
                  'templateItemOf': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/templateItemOf'
                  },
                  'metrics': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1/metrics'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/3c43135f-3e8b-46c2-bac3-288ed58e3fc1'
                  }
                }
              },
              'submissionDefinition': {
                'id': 'publication',
                'name': 'publication',
                'type': 'submissiondefinition',
                'isDefault': true,
                '_links': {
                  'collections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/collections'
                  },
                  'sections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/sections'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication'
                  }
                }
              },
              'collection': {
                'id': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                'uuid': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                'name': 'Publication',
                'handle': '123456789/6',
                'metadata': {
                  'dc.identifier.uri': [
                    {
                      'value': 'https://dspacecris7.4science.cloud/handle/123456789/6',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'type': 'collection',
                '_links': {
                  'harvester': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/harvester'
                  },
                  'itemtemplate': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemtemplate'
                  },
                  'license': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/license'
                  },
                  'logo': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/logo'
                  },
                  'mappedItems': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/mappedItems'
                  },
                  'parentCommunity': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/parentCommunity'
                  },
                  'adminGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/adminGroup'
                  },
                  'submittersGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/submittersGroup'
                  },
                  'itemReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemReadGroup'
                  },
                  'bitstreamReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/bitstreamReadGroup'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58'
                  },
                  'workflowGroups': [
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/editor',
                      'name': 'editor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/finaleditor',
                      'name': 'finaleditor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/reviewer',
                      'name': 'reviewer'
                    }
                  ]
                }
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241'
          }
        },
        'indexableObject': {
          'uuid': 'workspaceitem-241',
          'id': 241,
          'lastModified': '2021-04-26T21:16:19.928+0000',
          'sections': {
            'license': {
              'url': null,
              'acceptanceDate': null,
              'granted': false
            },
            'publication_references': {},
            'upload': {
              'files': [
                {
                  'uuid': '098d9791-b464-4a11-9c8f-95971d300c05',
                  'metadata': {
                    'dc.source': [
                      {
                        'value': 'cerif-frbr.pdf',
                        'language': null,
                        'authority': null,
                        'confidence': -1,
                        'place': 0
                      }
                    ],
                    'dc.title': [
                      {
                        'value': 'cerif-frbr.pdf',
                        'language': null,
                        'authority': null,
                        'confidence': -1,
                        'place': 0
                      }
                    ]
                  },
                  'accessConditions': [],
                  'format': {
                    'id': 4,
                    'shortDescription': 'Adobe PDF',
                    'description': 'Adobe Portable Document Format',
                    'mimetype': 'application/pdf',
                    'supportLevel': 'KNOWN',
                    'internal': false,
                    'extensions': [
                      'pdf'
                    ],
                    'type': 'bitstreamformat'
                  },
                  'sizeBytes': 1537579,
                  'checkSum': {
                    'checkSumAlgorithm': 'MD5',
                    'value': 'abdc75986daae51f0876b8be2351c309'
                  },
                  'url': 'https://dspacecris7.4science.cloud/server/api/core/bitstreams/098d9791-b464-4a11-9c8f-95971d300c05/content'
                }
              ]
            },
            'publication': {
              'dc.contributor.author': [
                {
                  'value': 'Dvořák, Jan',
                  'language': null,
                  'authority': null,
                  'confidence': 400,
                  'place': 0
                },
                {
                  'value': 'Drobíková, Barbora',
                  'language': null,
                  'authority': null,
                  'confidence': 400,
                  'place': 1
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 400,
                  'place': 2
                }
              ],
              'dc.title': [
                {
                  'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                },
                {
                  'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 1
                },
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 2
                }
              ],
              'dc.date.issued': [
                {
                  'value': '2006',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ]
            },
            'publication_indexing': {
              'dc.description.abstract': [
                {
                  'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.subject': [
                {
                  'value': 'CRIS',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                },
                {
                  'value': 'interoperability',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 1
                },
                {
                  'value': 'CERIF',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 2
                },
                {
                  'value': 'functions of scientific communication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 3
                },
                {
                  'value': 'publication metadata',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 4
                },
                {
                  'value': 'FRBR',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 5
                },
                {
                  'value': 'SWAP',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 6
                },
                {
                  'value': 'scholarly work',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 7
                },
                {
                  'value': 'expression',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 8
                },
                {
                  'value': 'manifestation',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 9
                },
                {
                  'value': 'research evaluation',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 10
                }
              ]
            },
            'detect-duplicate': {
              'matches': {
                '6e63adab-a02d-4722-a079-e1a8779cab3a': {
                  'submitterDecision': null,
                  'workflowDecision': null,
                  'adminDecision': null,
                  'submitterNote': null,
                  'workflowNote': null,
                  'matchObject': {
                    'id': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                    'uuid': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                    'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'handle': null,
                    'metadata': {
                      'dc.contributor.author': [
                        {
                          'value': 'Dvořák, Jan',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 0
                        },
                        {
                          'value': 'Drobíková, Barbora',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 1
                        },
                        {
                          'value': 'Bollini, Andrea',
                          'language': null,
                          'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                          'confidence': 400,
                          'place': 2
                        }
                      ],
                      'dc.description.abstract': [
                        {
                          'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.identifier': [
                        {
                          'value': '10.1016/j.procs.2014.06.008',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.subject': [
                        {
                          'value': 'CRIS',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': 'interoperability',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': 'CERIF',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 2
                        },
                        {
                          'value': 'functions of scientific communication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 3
                        },
                        {
                          'value': 'publication metadata',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 4
                        },
                        {
                          'value': 'FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 5
                        },
                        {
                          'value': 'SWAP',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 6
                        },
                        {
                          'value': 'scholarly work',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 7
                        },
                        {
                          'value': 'expression',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 8
                        },
                        {
                          'value': 'manifestation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 9
                        },
                        {
                          'value': 'research evaluation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 10
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dspace.entity.type': [
                        {
                          'value': 'Publication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ]
                    },
                    'inArchive': false,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-04-16T11:03:11.014+0000',
                    'entityType': 'Publication',
                    'type': 'item'
                  }
                },
                'eb4762fa-1046-443f-8f29-5e2c907c3c78': {
                  'submitterDecision': null,
                  'workflowDecision': null,
                  'adminDecision': null,
                  'submitterNote': null,
                  'workflowNote': null,
                  'matchObject': {
                    'id': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                    'uuid': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                    'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'handle': null,
                    'metadata': {
                      'dc.contributor.author': [
                        {
                          'value': 'Dvořák, Jan',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 0
                        },
                        {
                          'value': 'Drobíková, Barbora',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 1
                        },
                        {
                          'value': 'Bollini, Andrea',
                          'language': null,
                          'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                          'confidence': 400,
                          'place': 2
                        }
                      ],
                      'dc.description.abstract': [
                        {
                          'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.identifier': [
                        {
                          'value': '10.1016/j.procs.2014.06.008',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.subject': [
                        {
                          'value': 'CRIS',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': 'interoperability',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': 'CERIF',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 2
                        },
                        {
                          'value': 'functions of scientific communication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 3
                        },
                        {
                          'value': 'publication metadata',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 4
                        },
                        {
                          'value': 'FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 5
                        },
                        {
                          'value': 'SWAP',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 6
                        },
                        {
                          'value': 'scholarly work',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 7
                        },
                        {
                          'value': 'expression',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 8
                        },
                        {
                          'value': 'manifestation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 9
                        },
                        {
                          'value': 'research evaluation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 10
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dspace.entity.type': [
                        {
                          'value': 'Publication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ]
                    },
                    'inArchive': false,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-04-15T21:48:03.591+0000',
                    'entityType': 'Publication',
                    'type': 'item'
                  }
                }
              }
            },
            'collection': '8bb47238-2964-4d9f-be56-e912bf17ac58',
            'publication_bibliographic_details': {}
          },
          'errors': [
            {
              'message': 'error.validation.required',
              'paths': [
                '/sections/publication/dc.type'
              ]
            }
          ],
          '_links': {
            'collection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/collection'
            },
            'item': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/item'
            },
            'submissionDefinition': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/submissionDefinition'
            },
            'submitter': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241/submitter'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/241'
            }
          },
          'type': 'workspaceitem',
          'item': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false,
                  'source': {
                    '_isScalar': false,
                    'source': {
                      '_isScalar': false
                    },
                    'operator': {}
                  },
                  'operator': {}
                },
                'operator': {}
              },
              'operator': {}
            },
            'operator': {}
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': 328,
            'errors': [
              {
                'message': 'error.validation.required',
                'paths': [
                  '/sections/publication/dc.date.issued',
                  '/sections/publication/dc.type'
                ]
              }
            ],
            'lastModified': '2021-04-26T21:16:20.586+0000',
            'sections': {
              'license': {
                'url': null,
                'acceptanceDate': null,
                'granted': false
              },
              'publication_references': {},
              'upload': {
                'files': []
              },
              'publication': {
                'dc.contributor.author': [
                  {
                    'value': 'Bollini, Andrea',
                    'language': null,
                    'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'confidence': 600,
                    'place': 0
                  }
                ],
                'dc.title': [
                  {
                    'value': 'aaaaaaaaaaaaaaaaaaaa',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ],
                'oairecerif.author.affiliation': [
                  {
                    'value': '4Science',
                    'language': null,
                    'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                    'confidence': 600,
                    'place': 0
                  }
                ]
              },
              'publication_indexing': {},
              'detect-duplicate': {},
              'collection': '6a96c5c8-38d7-4161-a6c3-0d3adcce1281',
              'publication_bibliographic_details': {}
            },
            'type': 'workspaceitem',
            '_links': {
              'collection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/collection'
              },
              'item': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/item'
              },
              'submissionDefinition': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/submissionDefinition'
              },
              'submitter': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/submitter'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328'
              }
            },
            '_embedded': {
              'submitter': {
                'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'name': 'dspacedemo+admin@gmail.com',
                'handle': null,
                'metadata': {
                  'dspace.agreements.cookies': [
                    {
                      'value': '{"authentication":true,"preferences":true,"acknowledgement":true,"google-analytics":true}',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.agreements.end-user': [
                    {
                      'value': 'true',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.firstname': [
                    {
                      'value': 'Demo',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.lastname': [
                    {
                      'value': 'Site Administrator',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'netid': null,
                'lastActive': '2021-04-26T21:14:19.119+0000',
                'canLogIn': true,
                'email': 'dspacedemo+admin@gmail.com',
                'requireCertificate': false,
                'selfRegistered': false,
                'type': 'eperson',
                '_links': {
                  'groups': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda/groups'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda'
                  }
                }
              },
              'item': {
                'id': 'ee9db57b-0baf-4088-a1f8-74666181411d',
                'uuid': 'ee9db57b-0baf-4088-a1f8-74666181411d',
                'name': 'aaaaaaaaaaaaaaaaaaaa',
                'handle': null,
                'metadata': {
                  'dc.contributor.author': [
                    {
                      'value': 'Bollini, Andrea',
                      'language': null,
                      'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                      'confidence': 600,
                      'place': 0
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'aaaaaaaaaaaaaaaaaaaa',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'oairecerif.author.affiliation': [
                    {
                      'value': '4Science',
                      'language': null,
                      'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                      'confidence': 600,
                      'place': 0
                    }
                  ]
                },
                'inArchive': false,
                'discoverable': true,
                'withdrawn': false,
                'lastModified': '2021-01-22T08:41:39.447+0000',
                'entityType': 'Publication',
                'type': 'item',
                '_links': {
                  'bundles': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d/bundles'
                  },
                  'mappedCollections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d/mappedCollections'
                  },
                  'owningCollection': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d/owningCollection'
                  },
                  'relationships': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d/relationships'
                  },
                  'version': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d/version'
                  },
                  'templateItemOf': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d/templateItemOf'
                  },
                  'metrics': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d/metrics'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/ee9db57b-0baf-4088-a1f8-74666181411d'
                  }
                }
              },
              'submissionDefinition': {
                'id': 'publication',
                'name': 'publication',
                'type': 'submissiondefinition',
                'isDefault': true,
                '_links': {
                  'collections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/collections'
                  },
                  'sections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/sections'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication'
                  }
                }
              },
              'collection': {
                'id': '6a96c5c8-38d7-4161-a6c3-0d3adcce1281',
                'uuid': '6a96c5c8-38d7-4161-a6c3-0d3adcce1281',
                'name': 'Workflow 1 step',
                'handle': '123456789/24',
                'metadata': {
                  'dc.description': [
                    {
                      'value': null,
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.description.abstract': [
                    {
                      'value': null,
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.description.tableofcontents': [
                    {
                      'value': null,
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.identifier.uri': [
                    {
                      'value': 'https://dspacecris7.4science.cloud/handle/123456789/24',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.rights': [
                    {
                      'value': null,
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.rights.license': [
                    {
                      'value': null,
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'Workflow 1 step',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'type': 'collection',
                '_links': {
                  'harvester': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/harvester'
                  },
                  'itemtemplate': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/itemtemplate'
                  },
                  'license': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/license'
                  },
                  'logo': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/logo'
                  },
                  'mappedItems': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/mappedItems'
                  },
                  'parentCommunity': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/parentCommunity'
                  },
                  'adminGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/adminGroup'
                  },
                  'submittersGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/submittersGroup'
                  },
                  'itemReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/itemReadGroup'
                  },
                  'bitstreamReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/bitstreamReadGroup'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281'
                  },
                  'workflowGroups': [
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/workflowGroups/editor',
                      'name': 'editor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/workflowGroups/finaleditor',
                      'name': 'finaleditor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/6a96c5c8-38d7-4161-a6c3-0d3adcce1281/workflowGroups/reviewer',
                      'name': 'reviewer'
                    }
                  ]
                }
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328'
          }
        },
        'indexableObject': {
          'uuid': 'workspaceitem-328',
          'id': 328,
          'lastModified': '2021-04-26T21:16:20.586+0000',
          'sections': {
            'license': {
              'url': null,
              'acceptanceDate': null,
              'granted': false
            },
            'publication_references': {},
            'upload': {
              'files': []
            },
            'publication': {
              'dc.contributor.author': [
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 600,
                  'place': 0
                }
              ],
              'dc.title': [
                {
                  'value': 'aaaaaaaaaaaaaaaaaaaa',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 0
                }
              ]
            },
            'publication_indexing': {},
            'detect-duplicate': {},
            'collection': '6a96c5c8-38d7-4161-a6c3-0d3adcce1281',
            'publication_bibliographic_details': {}
          },
          'errors': [
            {
              'message': 'error.validation.required',
              'paths': [
                '/sections/publication/dc.date.issued',
                '/sections/publication/dc.type'
              ]
            }
          ],
          '_links': {
            'collection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/collection'
            },
            'item': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/item'
            },
            'submissionDefinition': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/submissionDefinition'
            },
            'submitter': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328/submitter'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/328'
            }
          },
          'type': 'workspaceitem',
          'item': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false,
                  'source': {
                    '_isScalar': false,
                    'source': {
                      '_isScalar': false
                    },
                    'operator': {}
                  },
                  'operator': {}
                },
                'operator': {}
              },
              'operator': {}
            },
            'operator': {}
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': 485,
            'errors': [
              {
                'message': 'error.validation.required',
                'paths': [
                  '/sections/publication/dc.date.issued',
                  '/sections/publication/dc.type'
                ]
              }
            ],
            'lastModified': '2021-04-26T21:16:20.854+0000',
            'sections': {
              'license': {
                'url': null,
                'acceptanceDate': null,
                'granted': false
              },
              'publication_references': {},
              'upload': {
                'files': [
                  {
                    'uuid': 'af8c7930-7943-41ba-abc7-e1266e6e0d4d',
                    'metadata': {
                      'dc.source': [
                        {
                          'value': 'cerif-frbr.pdf',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'cerif-frbr.pdf',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ]
                    },
                    'accessConditions': [],
                    'format': {
                      'id': 4,
                      'shortDescription': 'Adobe PDF',
                      'description': 'Adobe Portable Document Format',
                      'mimetype': 'application/pdf',
                      'supportLevel': 'KNOWN',
                      'internal': false,
                      'extensions': [
                        'pdf'
                      ],
                      'type': 'bitstreamformat'
                    },
                    'sizeBytes': 1537579,
                    'checkSum': {
                      'checkSumAlgorithm': 'MD5',
                      'value': 'abdc75986daae51f0876b8be2351c309'
                    },
                    'url': 'https://dspacecris7.4science.cloud/server/api/core/bitstreams/af8c7930-7943-41ba-abc7-e1266e6e0d4d/content'
                  }
                ]
              },
              'publication': {
                'dc.contributor.author': [
                  {
                    'value': 'Dvořák, Jan',
                    'language': null,
                    'authority': null,
                    'confidence': 400,
                    'place': 0
                  },
                  {
                    'value': 'Drobíková, Barbora',
                    'language': null,
                    'authority': null,
                    'confidence': 400,
                    'place': 1
                  },
                  {
                    'value': 'Bollini, Andrea',
                    'language': null,
                    'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'confidence': 400,
                    'place': 2
                  }
                ],
                'dc.title': [
                  {
                    'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ]
              },
              'publication_indexing': {
                'dc.description.abstract': [
                  {
                    'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ],
                'dc.subject': [
                  {
                    'value': 'CRIS',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  },
                  {
                    'value': 'interoperability',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 1
                  },
                  {
                    'value': 'CERIF',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 2
                  },
                  {
                    'value': 'functions of scientific communication',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 3
                  },
                  {
                    'value': 'publication metadata',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 4
                  },
                  {
                    'value': 'FRBR',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 5
                  },
                  {
                    'value': 'SWAP',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 6
                  },
                  {
                    'value': 'scholarly work',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 7
                  },
                  {
                    'value': 'expression',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 8
                  },
                  {
                    'value': 'manifestation',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 9
                  },
                  {
                    'value': 'research evaluation',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 10
                  }
                ]
              },
              'detect-duplicate': {
                'matches': {
                  '6e63adab-a02d-4722-a079-e1a8779cab3a': {
                    'submitterDecision': null,
                    'workflowDecision': null,
                    'adminDecision': null,
                    'submitterNote': null,
                    'workflowNote': null,
                    'matchObject': {
                      'id': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                      'uuid': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                      'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'handle': null,
                      'metadata': {
                        'dc.contributor.author': [
                          {
                            'value': 'Dvořák, Jan',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 0
                          },
                          {
                            'value': 'Drobíková, Barbora',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 1
                          },
                          {
                            'value': 'Bollini, Andrea',
                            'language': null,
                            'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                            'confidence': 400,
                            'place': 2
                          }
                        ],
                        'dc.description.abstract': [
                          {
                            'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.identifier': [
                          {
                            'value': '10.1016/j.procs.2014.06.008',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.subject': [
                          {
                            'value': 'CRIS',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': 'interoperability',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': 'CERIF',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 2
                          },
                          {
                            'value': 'functions of scientific communication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 3
                          },
                          {
                            'value': 'publication metadata',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 4
                          },
                          {
                            'value': 'FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 5
                          },
                          {
                            'value': 'SWAP',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 6
                          },
                          {
                            'value': 'scholarly work',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 7
                          },
                          {
                            'value': 'expression',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 8
                          },
                          {
                            'value': 'manifestation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 9
                          },
                          {
                            'value': 'research evaluation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 10
                          }
                        ],
                        'dc.title': [
                          {
                            'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dspace.entity.type': [
                          {
                            'value': 'Publication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ]
                      },
                      'inArchive': false,
                      'discoverable': true,
                      'withdrawn': false,
                      'lastModified': '2021-04-16T11:03:11.014+0000',
                      'entityType': 'Publication',
                      'type': 'item'
                    }
                  },
                  '3c43135f-3e8b-46c2-bac3-288ed58e3fc1': {
                    'submitterDecision': null,
                    'workflowDecision': null,
                    'adminDecision': null,
                    'submitterNote': null,
                    'workflowNote': null,
                    'matchObject': {
                      'id': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                      'uuid': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                      'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'handle': null,
                      'metadata': {
                        'dc.contributor.author': [
                          {
                            'value': 'Dvořák, Jan',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 0
                          },
                          {
                            'value': 'Drobíková, Barbora',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 1
                          },
                          {
                            'value': 'Bollini, Andrea',
                            'language': null,
                            'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                            'confidence': 400,
                            'place': 2
                          }
                        ],
                        'dc.date.issued': [
                          {
                            'value': '2006',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.description.abstract': [
                          {
                            'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.identifier': [
                          {
                            'value': '10.1016/j.procs.2014.06.008',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.subject': [
                          {
                            'value': 'CRIS',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': 'interoperability',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': 'CERIF',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 2
                          },
                          {
                            'value': 'functions of scientific communication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 3
                          },
                          {
                            'value': 'publication metadata',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 4
                          },
                          {
                            'value': 'FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 5
                          },
                          {
                            'value': 'SWAP',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 6
                          },
                          {
                            'value': 'scholarly work',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 7
                          },
                          {
                            'value': 'expression',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 8
                          },
                          {
                            'value': 'manifestation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 9
                          },
                          {
                            'value': 'research evaluation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 10
                          }
                        ],
                        'dc.title': [
                          {
                            'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dspace.entity.type': [
                          {
                            'value': 'Publication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'oairecerif.author.affiliation': [
                          {
                            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': '4Science',
                            'language': null,
                            'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                            'confidence': 600,
                            'place': 2
                          }
                        ]
                      },
                      'inArchive': false,
                      'discoverable': true,
                      'withdrawn': false,
                      'lastModified': '2020-12-07T10:10:11.248+0000',
                      'entityType': 'Publication',
                      'type': 'item'
                    }
                  }
                }
              },
              'collection': '8bb47238-2964-4d9f-be56-e912bf17ac58',
              'publication_bibliographic_details': {}
            },
            'type': 'workspaceitem',
            '_links': {
              'collection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/collection'
              },
              'item': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/item'
              },
              'submissionDefinition': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/submissionDefinition'
              },
              'submitter': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/submitter'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485'
              }
            },
            '_embedded': {
              'submitter': {
                'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'name': 'dspacedemo+admin@gmail.com',
                'handle': null,
                'metadata': {
                  'dspace.agreements.cookies': [
                    {
                      'value': '{"authentication":true,"preferences":true,"acknowledgement":true,"google-analytics":true}',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.agreements.end-user': [
                    {
                      'value': 'true',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.firstname': [
                    {
                      'value': 'Demo',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.lastname': [
                    {
                      'value': 'Site Administrator',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'netid': null,
                'lastActive': '2021-04-26T21:14:19.119+0000',
                'canLogIn': true,
                'email': 'dspacedemo+admin@gmail.com',
                'requireCertificate': false,
                'selfRegistered': false,
                'type': 'eperson',
                '_links': {
                  'groups': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda/groups'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda'
                  }
                }
              },
              'item': {
                'id': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                'uuid': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                'handle': null,
                'metadata': {
                  'dc.contributor.author': [
                    {
                      'value': 'Dvořák, Jan',
                      'language': null,
                      'authority': null,
                      'confidence': 400,
                      'place': 0
                    },
                    {
                      'value': 'Drobíková, Barbora',
                      'language': null,
                      'authority': null,
                      'confidence': 400,
                      'place': 1
                    },
                    {
                      'value': 'Bollini, Andrea',
                      'language': null,
                      'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                      'confidence': 400,
                      'place': 2
                    }
                  ],
                  'dc.description.abstract': [
                    {
                      'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.identifier': [
                    {
                      'value': '10.1016/j.procs.2014.06.008',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.subject': [
                    {
                      'value': 'CRIS',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    },
                    {
                      'value': 'interoperability',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 1
                    },
                    {
                      'value': 'CERIF',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 2
                    },
                    {
                      'value': 'functions of scientific communication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 3
                    },
                    {
                      'value': 'publication metadata',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 4
                    },
                    {
                      'value': 'FRBR',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 5
                    },
                    {
                      'value': 'SWAP',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 6
                    },
                    {
                      'value': 'scholarly work',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 7
                    },
                    {
                      'value': 'expression',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 8
                    },
                    {
                      'value': 'manifestation',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 9
                    },
                    {
                      'value': 'research evaluation',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 10
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'inArchive': false,
                'discoverable': true,
                'withdrawn': false,
                'lastModified': '2021-04-15T21:48:03.591+0000',
                'entityType': 'Publication',
                'type': 'item',
                '_links': {
                  'bundles': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78/bundles'
                  },
                  'mappedCollections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78/mappedCollections'
                  },
                  'owningCollection': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78/owningCollection'
                  },
                  'relationships': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78/relationships'
                  },
                  'version': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78/version'
                  },
                  'templateItemOf': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78/templateItemOf'
                  },
                  'metrics': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78/metrics'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/eb4762fa-1046-443f-8f29-5e2c907c3c78'
                  }
                }
              },
              'submissionDefinition': {
                'id': 'publication',
                'name': 'publication',
                'type': 'submissiondefinition',
                'isDefault': true,
                '_links': {
                  'collections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/collections'
                  },
                  'sections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/sections'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication'
                  }
                }
              },
              'collection': {
                'id': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                'uuid': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                'name': 'Publication',
                'handle': '123456789/6',
                'metadata': {
                  'dc.identifier.uri': [
                    {
                      'value': 'https://dspacecris7.4science.cloud/handle/123456789/6',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'type': 'collection',
                '_links': {
                  'harvester': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/harvester'
                  },
                  'itemtemplate': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemtemplate'
                  },
                  'license': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/license'
                  },
                  'logo': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/logo'
                  },
                  'mappedItems': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/mappedItems'
                  },
                  'parentCommunity': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/parentCommunity'
                  },
                  'adminGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/adminGroup'
                  },
                  'submittersGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/submittersGroup'
                  },
                  'itemReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemReadGroup'
                  },
                  'bitstreamReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/bitstreamReadGroup'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58'
                  },
                  'workflowGroups': [
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/editor',
                      'name': 'editor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/finaleditor',
                      'name': 'finaleditor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/reviewer',
                      'name': 'reviewer'
                    }
                  ]
                }
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485'
          }
        },
        'indexableObject': {
          'uuid': 'workspaceitem-485',
          'id': 485,
          'lastModified': '2021-04-26T21:16:20.854+0000',
          'sections': {
            'license': {
              'url': null,
              'acceptanceDate': null,
              'granted': false
            },
            'publication_references': {},
            'upload': {
              'files': [
                {
                  'uuid': 'af8c7930-7943-41ba-abc7-e1266e6e0d4d',
                  'metadata': {
                    'dc.source': [
                      {
                        'value': 'cerif-frbr.pdf',
                        'language': null,
                        'authority': null,
                        'confidence': -1,
                        'place': 0
                      }
                    ],
                    'dc.title': [
                      {
                        'value': 'cerif-frbr.pdf',
                        'language': null,
                        'authority': null,
                        'confidence': -1,
                        'place': 0
                      }
                    ]
                  },
                  'accessConditions': [],
                  'format': {
                    'id': 4,
                    'shortDescription': 'Adobe PDF',
                    'description': 'Adobe Portable Document Format',
                    'mimetype': 'application/pdf',
                    'supportLevel': 'KNOWN',
                    'internal': false,
                    'extensions': [
                      'pdf'
                    ],
                    'type': 'bitstreamformat'
                  },
                  'sizeBytes': 1537579,
                  'checkSum': {
                    'checkSumAlgorithm': 'MD5',
                    'value': 'abdc75986daae51f0876b8be2351c309'
                  },
                  'url': 'https://dspacecris7.4science.cloud/server/api/core/bitstreams/af8c7930-7943-41ba-abc7-e1266e6e0d4d/content'
                }
              ]
            },
            'publication': {
              'dc.contributor.author': [
                {
                  'value': 'Dvořák, Jan',
                  'language': null,
                  'authority': null,
                  'confidence': 400,
                  'place': 0
                },
                {
                  'value': 'Drobíková, Barbora',
                  'language': null,
                  'authority': null,
                  'confidence': 400,
                  'place': 1
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 400,
                  'place': 2
                }
              ],
              'dc.title': [
                {
                  'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ]
            },
            'publication_indexing': {
              'dc.description.abstract': [
                {
                  'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.subject': [
                {
                  'value': 'CRIS',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                },
                {
                  'value': 'interoperability',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 1
                },
                {
                  'value': 'CERIF',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 2
                },
                {
                  'value': 'functions of scientific communication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 3
                },
                {
                  'value': 'publication metadata',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 4
                },
                {
                  'value': 'FRBR',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 5
                },
                {
                  'value': 'SWAP',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 6
                },
                {
                  'value': 'scholarly work',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 7
                },
                {
                  'value': 'expression',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 8
                },
                {
                  'value': 'manifestation',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 9
                },
                {
                  'value': 'research evaluation',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 10
                }
              ]
            },
            'detect-duplicate': {
              'matches': {
                '6e63adab-a02d-4722-a079-e1a8779cab3a': {
                  'submitterDecision': null,
                  'workflowDecision': null,
                  'adminDecision': null,
                  'submitterNote': null,
                  'workflowNote': null,
                  'matchObject': {
                    'id': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                    'uuid': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                    'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'handle': null,
                    'metadata': {
                      'dc.contributor.author': [
                        {
                          'value': 'Dvořák, Jan',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 0
                        },
                        {
                          'value': 'Drobíková, Barbora',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 1
                        },
                        {
                          'value': 'Bollini, Andrea',
                          'language': null,
                          'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                          'confidence': 400,
                          'place': 2
                        }
                      ],
                      'dc.description.abstract': [
                        {
                          'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.identifier': [
                        {
                          'value': '10.1016/j.procs.2014.06.008',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.subject': [
                        {
                          'value': 'CRIS',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': 'interoperability',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': 'CERIF',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 2
                        },
                        {
                          'value': 'functions of scientific communication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 3
                        },
                        {
                          'value': 'publication metadata',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 4
                        },
                        {
                          'value': 'FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 5
                        },
                        {
                          'value': 'SWAP',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 6
                        },
                        {
                          'value': 'scholarly work',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 7
                        },
                        {
                          'value': 'expression',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 8
                        },
                        {
                          'value': 'manifestation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 9
                        },
                        {
                          'value': 'research evaluation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 10
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dspace.entity.type': [
                        {
                          'value': 'Publication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ]
                    },
                    'inArchive': false,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-04-16T11:03:11.014+0000',
                    'entityType': 'Publication',
                    'type': 'item'
                  }
                },
                '3c43135f-3e8b-46c2-bac3-288ed58e3fc1': {
                  'submitterDecision': null,
                  'workflowDecision': null,
                  'adminDecision': null,
                  'submitterNote': null,
                  'workflowNote': null,
                  'matchObject': {
                    'id': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                    'uuid': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                    'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'handle': null,
                    'metadata': {
                      'dc.contributor.author': [
                        {
                          'value': 'Dvořák, Jan',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 0
                        },
                        {
                          'value': 'Drobíková, Barbora',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 1
                        },
                        {
                          'value': 'Bollini, Andrea',
                          'language': null,
                          'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                          'confidence': 400,
                          'place': 2
                        }
                      ],
                      'dc.date.issued': [
                        {
                          'value': '2006',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.description.abstract': [
                        {
                          'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.identifier': [
                        {
                          'value': '10.1016/j.procs.2014.06.008',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.subject': [
                        {
                          'value': 'CRIS',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': 'interoperability',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': 'CERIF',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 2
                        },
                        {
                          'value': 'functions of scientific communication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 3
                        },
                        {
                          'value': 'publication metadata',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 4
                        },
                        {
                          'value': 'FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 5
                        },
                        {
                          'value': 'SWAP',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 6
                        },
                        {
                          'value': 'scholarly work',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 7
                        },
                        {
                          'value': 'expression',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 8
                        },
                        {
                          'value': 'manifestation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 9
                        },
                        {
                          'value': 'research evaluation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 10
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dspace.entity.type': [
                        {
                          'value': 'Publication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'oairecerif.author.affiliation': [
                        {
                          'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': '4Science',
                          'language': null,
                          'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                          'confidence': 600,
                          'place': 2
                        }
                      ]
                    },
                    'inArchive': false,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2020-12-07T10:10:11.248+0000',
                    'entityType': 'Publication',
                    'type': 'item'
                  }
                }
              }
            },
            'collection': '8bb47238-2964-4d9f-be56-e912bf17ac58',
            'publication_bibliographic_details': {}
          },
          'errors': [
            {
              'message': 'error.validation.required',
              'paths': [
                '/sections/publication/dc.date.issued',
                '/sections/publication/dc.type'
              ]
            }
          ],
          '_links': {
            'collection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/collection'
            },
            'item': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/item'
            },
            'submissionDefinition': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/submissionDefinition'
            },
            'submitter': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485/submitter'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/485'
            }
          },
          'type': 'workspaceitem',
          'item': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false,
                  'source': {
                    '_isScalar': false,
                    'source': {
                      '_isScalar': false
                    },
                    'operator': {}
                  },
                  'operator': {}
                },
                'operator': {}
              },
              'operator': {}
            },
            'operator': {}
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': 'afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e',
            'uuid': 'afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e',
            'name': 'Anti-Daltonism screens and glasses',
            'handle': '123456789/181',
            'metadata': {
              'dc.contributor.author': [
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': 'Lombardi, Corrado',
                  'language': null,
                  'authority': 'b5ad6864-012d-4989-8e0d-4acfa1156fd9',
                  'confidence': 600,
                  'place': 1
                }
              ],
              'dc.date.accessioned': [
                {
                  'value': '2021-04-15T20:20:33Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.available': [
                {
                  'value': '2021-04-15T20:20:33Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.issued': [
                {
                  'value': '1953-02-09',
                  'language': null,
                  'authority': null,
                  'confidence': 0,
                  'place': 0
                }
              ],
              'dc.description.provenance': [
                {
                  'value': 'Made available in DSpace on 2021-04-15T20:20:33Z (GMT). No. of bitstreams: 0  Previous issue date:    9',
                  'language': 'en',
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.pmid': [
                {
                  'value': '13051875',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.uri': [
                {
                  'value': 'https://dspacecris7.4science.cloud/handle/123456789/181',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.relation.ispartof': [
                {
                  'value': 'C R Hebd Seances Acad Sci',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.title': [
                {
                  'value': 'Anti-Daltonism screens and glasses',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.type': [
                {
                  'value': 'Controlled Vocabulary for Resource Type Genres::other',
                  'language': null,
                  'authority': 'types:c_1843',
                  'confidence': 600,
                  'place': 0
                }
              ],
              'dspace.entity.type': [
                {
                  'value': 'Publication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 1
                }
              ]
            },
            'inArchive': true,
            'discoverable': true,
            'withdrawn': false,
            'lastModified': '2021-04-15T20:40:40.592+0000',
            'entityType': 'Publication',
            'type': 'item',
            '_links': {
              'bundles': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/bundles'
              },
              'mappedCollections': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/mappedCollections'
              },
              'owningCollection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/owningCollection'
              },
              'relationships': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/relationships'
              },
              'version': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/version'
              },
              'templateItemOf': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/templateItemOf'
              },
              'metrics': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/metrics'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e'
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e'
          }
        },
        'indexableObject': {
          'handle': '123456789/181',
          'lastModified': '2021-04-15T20:40:40.592+0000',
          'isArchived': true,
          'isDiscoverable': true,
          'isWithdrawn': false,
          '_links': {
            'bundles': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/bundles'
            },
            'mappedCollections': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/mappedCollections'
            },
            'owningCollection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/owningCollection'
            },
            'relationships': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/relationships'
            },
            'version': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/version'
            },
            'templateItemOf': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/templateItemOf'
            },
            'metrics': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e/metrics'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e'
            }
          },
          '_name': 'Anti-Daltonism screens and glasses',
          'id': 'afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e',
          'uuid': 'afc9a6cd-0f1b-4fc9-a88b-818d5666fb8e',
          'type': 'item',
          'metadata': {
            'dc.contributor.author': [
              {
                'uuid': 'e5ed24a1-b25f-47ce-a1f9-ed02737f2d4a',
                'language': null,
                'value': 'Bollini, Andrea',
                'place': 0,
                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                'confidence': 600
              },
              {
                'uuid': '17209f50-a1e0-46c5-a920-e8dace1a6145',
                'language': null,
                'value': 'Lombardi, Corrado',
                'place': 1,
                'authority': 'b5ad6864-012d-4989-8e0d-4acfa1156fd9',
                'confidence': 600
              }
            ],
            'dc.date.accessioned': [
              {
                'uuid': '22b57993-d8d1-4261-a9cc-2e975e9a5c6a',
                'language': null,
                'value': '2021-04-15T20:20:33Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.available': [
              {
                'uuid': '581ee540-e5fb-4a93-8804-b6a55bcf263f',
                'language': null,
                'value': '2021-04-15T20:20:33Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.issued': [
              {
                'uuid': '34f4669c-fcfe-4b3f-8ce1-b495ce5c3202',
                'language': null,
                'value': '1953-02-09',
                'place': 0,
                'authority': null,
                'confidence': 0
              }
            ],
            'dc.description.provenance': [
              {
                'uuid': 'b220b344-94e1-40d5-8e57-633942ec0c2f',
                'language': 'en',
                'value': 'Made available in DSpace on 2021-04-15T20:20:33Z (GMT). No. of bitstreams: 0  Previous issue date:    9',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.pmid': [
              {
                'uuid': '20ce5874-dc5d-4a58-af62-08e4205a49a5',
                'language': null,
                'value': '13051875',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.uri': [
              {
                'uuid': '64763282-a579-4e61-9258-3d04fab4b42a',
                'language': null,
                'value': 'https://dspacecris7.4science.cloud/handle/123456789/181',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.relation.ispartof': [
              {
                'uuid': '55650fde-e0c6-413d-a2fb-a65490d38593',
                'language': null,
                'value': 'C R Hebd Seances Acad Sci',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.title': [
              {
                'uuid': 'cb7c11f7-e25f-4b85-b34e-b07605c82a21',
                'language': null,
                'value': 'Anti-Daltonism screens and glasses',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.type': [
              {
                'uuid': '3636b63d-b6a0-473f-a6b0-4d63950469fd',
                'language': null,
                'value': 'Controlled Vocabulary for Resource Type Genres::other',
                'place': 0,
                'authority': 'types:c_1843',
                'confidence': 600
              }
            ],
            'dspace.entity.type': [
              {
                'uuid': '9c8184be-46b7-4348-8a96-5c75fc9f7af1',
                'language': null,
                'value': 'Publication',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'oairecerif.author.affiliation': [
              {
                'uuid': '092f0928-2d76-4fd7-a25b-5d0fdadcdd07',
                'language': null,
                'value': '4Science',
                'place': 0,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              },
              {
                'uuid': '8f0e0598-6c34-49ce-889c-f4518870a7bf',
                'language': null,
                'value': '4Science',
                'place': 1,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              }
            ]
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': 490,
            'errors': [
              {
                'message': 'error.validation.required',
                'paths': [
                  '/sections/publication/dc.date.issued',
                  '/sections/publication/dc.type'
                ]
              }
            ],
            'lastModified': '2021-04-26T21:16:21.340+0000',
            'sections': {
              'license': {
                'url': null,
                'acceptanceDate': null,
                'granted': false
              },
              'publication_references': {},
              'upload': {
                'files': [
                  {
                    'uuid': 'f9e0012e-1f0a-420c-bdd1-1936b9eb25fa',
                    'metadata': {
                      'dc.source': [
                        {
                          'value': 'cerif-frbr.pdf',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'cerif-frbr.pdf',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ]
                    },
                    'accessConditions': [],
                    'format': {
                      'id': 4,
                      'shortDescription': 'Adobe PDF',
                      'description': 'Adobe Portable Document Format',
                      'mimetype': 'application/pdf',
                      'supportLevel': 'KNOWN',
                      'internal': false,
                      'extensions': [
                        'pdf'
                      ],
                      'type': 'bitstreamformat'
                    },
                    'sizeBytes': 1537579,
                    'checkSum': {
                      'checkSumAlgorithm': 'MD5',
                      'value': 'abdc75986daae51f0876b8be2351c309'
                    },
                    'url': 'https://dspacecris7.4science.cloud/server/api/core/bitstreams/f9e0012e-1f0a-420c-bdd1-1936b9eb25fa/content'
                  }
                ]
              },
              'publication': {
                'dc.contributor.author': [
                  {
                    'value': 'Dvořák, Jan',
                    'language': null,
                    'authority': null,
                    'confidence': 400,
                    'place': 0
                  },
                  {
                    'value': 'Drobíková, Barbora',
                    'language': null,
                    'authority': null,
                    'confidence': 400,
                    'place': 1
                  },
                  {
                    'value': 'Bollini, Andrea',
                    'language': null,
                    'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'confidence': 400,
                    'place': 2
                  }
                ],
                'dc.title': [
                  {
                    'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ]
              },
              'publication_indexing': {
                'dc.description.abstract': [
                  {
                    'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  }
                ],
                'dc.subject': [
                  {
                    'value': 'CRIS',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 0
                  },
                  {
                    'value': 'interoperability',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 1
                  },
                  {
                    'value': 'CERIF',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 2
                  },
                  {
                    'value': 'functions of scientific communication',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 3
                  },
                  {
                    'value': 'publication metadata',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 4
                  },
                  {
                    'value': 'FRBR',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 5
                  },
                  {
                    'value': 'SWAP',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 6
                  },
                  {
                    'value': 'scholarly work',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 7
                  },
                  {
                    'value': 'expression',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 8
                  },
                  {
                    'value': 'manifestation',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 9
                  },
                  {
                    'value': 'research evaluation',
                    'language': null,
                    'authority': null,
                    'confidence': -1,
                    'place': 10
                  }
                ]
              },
              'detect-duplicate': {
                'matches': {
                  'eb4762fa-1046-443f-8f29-5e2c907c3c78': {
                    'submitterDecision': null,
                    'workflowDecision': null,
                    'adminDecision': null,
                    'submitterNote': null,
                    'workflowNote': null,
                    'matchObject': {
                      'id': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                      'uuid': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                      'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'handle': null,
                      'metadata': {
                        'dc.contributor.author': [
                          {
                            'value': 'Dvořák, Jan',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 0
                          },
                          {
                            'value': 'Drobíková, Barbora',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 1
                          },
                          {
                            'value': 'Bollini, Andrea',
                            'language': null,
                            'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                            'confidence': 400,
                            'place': 2
                          }
                        ],
                        'dc.description.abstract': [
                          {
                            'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.identifier': [
                          {
                            'value': '10.1016/j.procs.2014.06.008',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.subject': [
                          {
                            'value': 'CRIS',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': 'interoperability',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': 'CERIF',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 2
                          },
                          {
                            'value': 'functions of scientific communication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 3
                          },
                          {
                            'value': 'publication metadata',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 4
                          },
                          {
                            'value': 'FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 5
                          },
                          {
                            'value': 'SWAP',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 6
                          },
                          {
                            'value': 'scholarly work',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 7
                          },
                          {
                            'value': 'expression',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 8
                          },
                          {
                            'value': 'manifestation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 9
                          },
                          {
                            'value': 'research evaluation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 10
                          }
                        ],
                        'dc.title': [
                          {
                            'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dspace.entity.type': [
                          {
                            'value': 'Publication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ]
                      },
                      'inArchive': false,
                      'discoverable': true,
                      'withdrawn': false,
                      'lastModified': '2021-04-15T21:48:03.591+0000',
                      'entityType': 'Publication',
                      'type': 'item'
                    }
                  },
                  '3c43135f-3e8b-46c2-bac3-288ed58e3fc1': {
                    'submitterDecision': null,
                    'workflowDecision': null,
                    'adminDecision': null,
                    'submitterNote': null,
                    'workflowNote': null,
                    'matchObject': {
                      'id': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                      'uuid': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                      'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'handle': null,
                      'metadata': {
                        'dc.contributor.author': [
                          {
                            'value': 'Dvořák, Jan',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 0
                          },
                          {
                            'value': 'Drobíková, Barbora',
                            'language': null,
                            'authority': null,
                            'confidence': 400,
                            'place': 1
                          },
                          {
                            'value': 'Bollini, Andrea',
                            'language': null,
                            'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                            'confidence': 400,
                            'place': 2
                          }
                        ],
                        'dc.date.issued': [
                          {
                            'value': '2006',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.description.abstract': [
                          {
                            'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.identifier': [
                          {
                            'value': '10.1016/j.procs.2014.06.008',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dc.subject': [
                          {
                            'value': 'CRIS',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': 'interoperability',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': 'CERIF',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 2
                          },
                          {
                            'value': 'functions of scientific communication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 3
                          },
                          {
                            'value': 'publication metadata',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 4
                          },
                          {
                            'value': 'FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 5
                          },
                          {
                            'value': 'SWAP',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 6
                          },
                          {
                            'value': 'scholarly work',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 7
                          },
                          {
                            'value': 'expression',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 8
                          },
                          {
                            'value': 'manifestation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 9
                          },
                          {
                            'value': 'research evaluation',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 10
                          }
                        ],
                        'dc.title': [
                          {
                            'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'dspace.entity.type': [
                          {
                            'value': 'Publication',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          }
                        ],
                        'oairecerif.author.affiliation': [
                          {
                            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 0
                          },
                          {
                            'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                            'language': null,
                            'authority': null,
                            'confidence': -1,
                            'place': 1
                          },
                          {
                            'value': '4Science',
                            'language': null,
                            'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                            'confidence': 600,
                            'place': 2
                          }
                        ]
                      },
                      'inArchive': false,
                      'discoverable': true,
                      'withdrawn': false,
                      'lastModified': '2020-12-07T10:10:11.248+0000',
                      'entityType': 'Publication',
                      'type': 'item'
                    }
                  }
                }
              },
              'collection': '8bb47238-2964-4d9f-be56-e912bf17ac58',
              'publication_bibliographic_details': {}
            },
            'type': 'workspaceitem',
            '_links': {
              'collection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/collection'
              },
              'item': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/item'
              },
              'submissionDefinition': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/submissionDefinition'
              },
              'submitter': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/submitter'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490'
              }
            },
            '_embedded': {
              'submitter': {
                'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                'name': 'dspacedemo+admin@gmail.com',
                'handle': null,
                'metadata': {
                  'dspace.agreements.cookies': [
                    {
                      'value': '{"authentication":true,"preferences":true,"acknowledgement":true,"google-analytics":true}',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.agreements.end-user': [
                    {
                      'value': 'true',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.firstname': [
                    {
                      'value': 'Demo',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'eperson.lastname': [
                    {
                      'value': 'Site Administrator',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'netid': null,
                'lastActive': '2021-04-26T21:14:19.119+0000',
                'canLogIn': true,
                'email': 'dspacedemo+admin@gmail.com',
                'requireCertificate': false,
                'selfRegistered': false,
                'type': 'eperson',
                '_links': {
                  'groups': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda/groups'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/eperson/epersons/335647b6-8a52-4ecb-a8c1-7ebabb199bda'
                  }
                }
              },
              'item': {
                'id': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                'uuid': '6e63adab-a02d-4722-a079-e1a8779cab3a',
                'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                'handle': null,
                'metadata': {
                  'dc.contributor.author': [
                    {
                      'value': 'Dvořák, Jan',
                      'language': null,
                      'authority': null,
                      'confidence': 400,
                      'place': 0
                    },
                    {
                      'value': 'Drobíková, Barbora',
                      'language': null,
                      'authority': null,
                      'confidence': 400,
                      'place': 1
                    },
                    {
                      'value': 'Bollini, Andrea',
                      'language': null,
                      'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                      'confidence': 400,
                      'place': 2
                    }
                  ],
                  'dc.description.abstract': [
                    {
                      'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.identifier': [
                    {
                      'value': '10.1016/j.procs.2014.06.008',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.subject': [
                    {
                      'value': 'CRIS',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    },
                    {
                      'value': 'interoperability',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 1
                    },
                    {
                      'value': 'CERIF',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 2
                    },
                    {
                      'value': 'functions of scientific communication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 3
                    },
                    {
                      'value': 'publication metadata',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 4
                    },
                    {
                      'value': 'FRBR',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 5
                    },
                    {
                      'value': 'SWAP',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 6
                    },
                    {
                      'value': 'scholarly work',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 7
                    },
                    {
                      'value': 'expression',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 8
                    },
                    {
                      'value': 'manifestation',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 9
                    },
                    {
                      'value': 'research evaluation',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 10
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'inArchive': false,
                'discoverable': true,
                'withdrawn': false,
                'lastModified': '2021-04-16T11:03:11.014+0000',
                'entityType': 'Publication',
                'type': 'item',
                '_links': {
                  'bundles': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a/bundles'
                  },
                  'mappedCollections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a/mappedCollections'
                  },
                  'owningCollection': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a/owningCollection'
                  },
                  'relationships': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a/relationships'
                  },
                  'version': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a/version'
                  },
                  'templateItemOf': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a/templateItemOf'
                  },
                  'metrics': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a/metrics'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/items/6e63adab-a02d-4722-a079-e1a8779cab3a'
                  }
                }
              },
              'submissionDefinition': {
                'id': 'publication',
                'name': 'publication',
                'type': 'submissiondefinition',
                'isDefault': true,
                '_links': {
                  'collections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/collections'
                  },
                  'sections': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication/sections'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/config/submissiondefinitions/publication'
                  }
                }
              },
              'collection': {
                'id': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                'uuid': '8bb47238-2964-4d9f-be56-e912bf17ac58',
                'name': 'Publication',
                'handle': '123456789/6',
                'metadata': {
                  'dc.identifier.uri': [
                    {
                      'value': 'https://dspacecris7.4science.cloud/handle/123456789/6',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dc.title': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ],
                  'dspace.entity.type': [
                    {
                      'value': 'Publication',
                      'language': null,
                      'authority': null,
                      'confidence': -1,
                      'place': 0
                    }
                  ]
                },
                'type': 'collection',
                '_links': {
                  'harvester': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/harvester'
                  },
                  'itemtemplate': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemtemplate'
                  },
                  'license': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/license'
                  },
                  'logo': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/logo'
                  },
                  'mappedItems': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/mappedItems'
                  },
                  'parentCommunity': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/parentCommunity'
                  },
                  'adminGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/adminGroup'
                  },
                  'submittersGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/submittersGroup'
                  },
                  'itemReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/itemReadGroup'
                  },
                  'bitstreamReadGroup': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/bitstreamReadGroup'
                  },
                  'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58'
                  },
                  'workflowGroups': [
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/editor',
                      'name': 'editor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/finaleditor',
                      'name': 'finaleditor'
                    },
                    {
                      'href': 'https://dspacecris7.4science.cloud/server/api/core/collections/8bb47238-2964-4d9f-be56-e912bf17ac58/workflowGroups/reviewer',
                      'name': 'reviewer'
                    }
                  ]
                }
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490'
          }
        },
        'indexableObject': {
          'uuid': 'workspaceitem-490',
          'id': 490,
          'lastModified': '2021-04-26T21:16:21.340+0000',
          'sections': {
            'license': {
              'url': null,
              'acceptanceDate': null,
              'granted': false
            },
            'publication_references': {},
            'upload': {
              'files': [
                {
                  'uuid': 'f9e0012e-1f0a-420c-bdd1-1936b9eb25fa',
                  'metadata': {
                    'dc.source': [
                      {
                        'value': 'cerif-frbr.pdf',
                        'language': null,
                        'authority': null,
                        'confidence': -1,
                        'place': 0
                      }
                    ],
                    'dc.title': [
                      {
                        'value': 'cerif-frbr.pdf',
                        'language': null,
                        'authority': null,
                        'confidence': -1,
                        'place': 0
                      }
                    ]
                  },
                  'accessConditions': [],
                  'format': {
                    'id': 4,
                    'shortDescription': 'Adobe PDF',
                    'description': 'Adobe Portable Document Format',
                    'mimetype': 'application/pdf',
                    'supportLevel': 'KNOWN',
                    'internal': false,
                    'extensions': [
                      'pdf'
                    ],
                    'type': 'bitstreamformat'
                  },
                  'sizeBytes': 1537579,
                  'checkSum': {
                    'checkSumAlgorithm': 'MD5',
                    'value': 'abdc75986daae51f0876b8be2351c309'
                  },
                  'url': 'https://dspacecris7.4science.cloud/server/api/core/bitstreams/f9e0012e-1f0a-420c-bdd1-1936b9eb25fa/content'
                }
              ]
            },
            'publication': {
              'dc.contributor.author': [
                {
                  'value': 'Dvořák, Jan',
                  'language': null,
                  'authority': null,
                  'confidence': 400,
                  'place': 0
                },
                {
                  'value': 'Drobíková, Barbora',
                  'language': null,
                  'authority': null,
                  'confidence': 400,
                  'place': 1
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 400,
                  'place': 2
                }
              ],
              'dc.title': [
                {
                  'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ]
            },
            'publication_indexing': {
              'dc.description.abstract': [
                {
                  'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.subject': [
                {
                  'value': 'CRIS',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                },
                {
                  'value': 'interoperability',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 1
                },
                {
                  'value': 'CERIF',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 2
                },
                {
                  'value': 'functions of scientific communication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 3
                },
                {
                  'value': 'publication metadata',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 4
                },
                {
                  'value': 'FRBR',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 5
                },
                {
                  'value': 'SWAP',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 6
                },
                {
                  'value': 'scholarly work',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 7
                },
                {
                  'value': 'expression',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 8
                },
                {
                  'value': 'manifestation',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 9
                },
                {
                  'value': 'research evaluation',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 10
                }
              ]
            },
            'detect-duplicate': {
              'matches': {
                'eb4762fa-1046-443f-8f29-5e2c907c3c78': {
                  'submitterDecision': null,
                  'workflowDecision': null,
                  'adminDecision': null,
                  'submitterNote': null,
                  'workflowNote': null,
                  'matchObject': {
                    'id': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                    'uuid': 'eb4762fa-1046-443f-8f29-5e2c907c3c78',
                    'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'handle': null,
                    'metadata': {
                      'dc.contributor.author': [
                        {
                          'value': 'Dvořák, Jan',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 0
                        },
                        {
                          'value': 'Drobíková, Barbora',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 1
                        },
                        {
                          'value': 'Bollini, Andrea',
                          'language': null,
                          'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                          'confidence': 400,
                          'place': 2
                        }
                      ],
                      'dc.description.abstract': [
                        {
                          'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.identifier': [
                        {
                          'value': '10.1016/j.procs.2014.06.008',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.subject': [
                        {
                          'value': 'CRIS',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': 'interoperability',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': 'CERIF',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 2
                        },
                        {
                          'value': 'functions of scientific communication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 3
                        },
                        {
                          'value': 'publication metadata',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 4
                        },
                        {
                          'value': 'FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 5
                        },
                        {
                          'value': 'SWAP',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 6
                        },
                        {
                          'value': 'scholarly work',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 7
                        },
                        {
                          'value': 'expression',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 8
                        },
                        {
                          'value': 'manifestation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 9
                        },
                        {
                          'value': 'research evaluation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 10
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dspace.entity.type': [
                        {
                          'value': 'Publication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ]
                    },
                    'inArchive': false,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-04-15T21:48:03.591+0000',
                    'entityType': 'Publication',
                    'type': 'item'
                  }
                },
                '3c43135f-3e8b-46c2-bac3-288ed58e3fc1': {
                  'submitterDecision': null,
                  'workflowDecision': null,
                  'adminDecision': null,
                  'submitterNote': null,
                  'workflowNote': null,
                  'matchObject': {
                    'id': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                    'uuid': '3c43135f-3e8b-46c2-bac3-288ed58e3fc1',
                    'name': 'Publication metadata in CERIF: Inspiration by FRBR',
                    'handle': null,
                    'metadata': {
                      'dc.contributor.author': [
                        {
                          'value': 'Dvořák, Jan',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 0
                        },
                        {
                          'value': 'Drobíková, Barbora',
                          'language': null,
                          'authority': null,
                          'confidence': 400,
                          'place': 1
                        },
                        {
                          'value': 'Bollini, Andrea',
                          'language': null,
                          'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                          'confidence': 400,
                          'place': 2
                        }
                      ],
                      'dc.date.issued': [
                        {
                          'value': '2006',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.description.abstract': [
                        {
                          'value': 'The Functional Requirements for Bibliographic Records (FRBR) and its Scholarly Works Application Profile (SWAP) are used to inspire the representation of complex real world situations in the publication part of the Common European Research Information Format (CERIF), the model for Current Research Information Systems (CRIS). CERIF is found to have room for different approaches to representing metadata of scholarly publications, which could hamper the interoperability of CRIS. To lessen that risk, we propose guidelines for representing scholarly publication metadata in CERIF; our design goal is to enhance the utility of CRIS in supporting the functions of scientific communication. The guidelines are formulated using the notions of Scholarly Work, Expression and Manifestation from FRBR/SWAP.',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.identifier': [
                        {
                          'value': '10.1016/j.procs.2014.06.008',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dc.subject': [
                        {
                          'value': 'CRIS',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': 'interoperability',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': 'CERIF',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 2
                        },
                        {
                          'value': 'functions of scientific communication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 3
                        },
                        {
                          'value': 'publication metadata',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 4
                        },
                        {
                          'value': 'FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 5
                        },
                        {
                          'value': 'SWAP',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 6
                        },
                        {
                          'value': 'scholarly work',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 7
                        },
                        {
                          'value': 'expression',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 8
                        },
                        {
                          'value': 'manifestation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 9
                        },
                        {
                          'value': 'research evaluation',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 10
                        }
                      ],
                      'dc.title': [
                        {
                          'value': 'Publication metadata in CERIF: Inspiration by FRBR',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'dspace.entity.type': [
                        {
                          'value': 'Publication',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        }
                      ],
                      'oairecerif.author.affiliation': [
                        {
                          'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 0
                        },
                        {
                          'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                          'language': null,
                          'authority': null,
                          'confidence': -1,
                          'place': 1
                        },
                        {
                          'value': '4Science',
                          'language': null,
                          'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                          'confidence': 600,
                          'place': 2
                        }
                      ]
                    },
                    'inArchive': false,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2020-12-07T10:10:11.248+0000',
                    'entityType': 'Publication',
                    'type': 'item'
                  }
                }
              }
            },
            'collection': '8bb47238-2964-4d9f-be56-e912bf17ac58',
            'publication_bibliographic_details': {}
          },
          'errors': [
            {
              'message': 'error.validation.required',
              'paths': [
                '/sections/publication/dc.date.issued',
                '/sections/publication/dc.type'
              ]
            }
          ],
          '_links': {
            'collection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/collection'
            },
            'item': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/item'
            },
            'submissionDefinition': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/submissionDefinition'
            },
            'submitter': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490/submitter'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/submission/workspaceitems/490'
            }
          },
          'type': 'workspaceitem',
          'item': {
            '_isScalar': false,
            'source': {
              '_isScalar': false,
              'source': {
                '_isScalar': false,
                'source': {
                  '_isScalar': false,
                  'source': {
                    '_isScalar': false,
                    'source': {
                      '_isScalar': false
                    },
                    'operator': {}
                  },
                  'operator': {}
                },
                'operator': {}
              },
              'operator': {}
            },
            'operator': {}
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': '60067f34-ccd4-4c38-a30d-130a98b391df',
            'uuid': '60067f34-ccd4-4c38-a30d-130a98b391df',
            'name': 'Clinical Outcomes Of A COVID-19 Vaccine: Implementation Over Efficacy',
            'handle': '123456789/173',
            'metadata': {
              'dc.contributor.author': [
                {
                  'value': 'Cortese, Claudio',
                  'language': null,
                  'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 600,
                  'place': 1
                }
              ],
              'dc.date.accessioned': [
                {
                  'value': '2021-04-15T20:20:31Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.available': [
                {
                  'value': '2021-04-15T20:20:31Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.issued': [
                {
                  'value': '2020-11-09',
                  'language': null,
                  'authority': null,
                  'confidence': 0,
                  'place': 0
                }
              ],
              'dc.description.provenance': [
                {
                  'value': 'Made available in DSpace on 2021-04-15T20:20:31Z (GMT). No. of bitstreams: 0  Previous issue date:    9',
                  'language': 'en',
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.doi': [
                {
                  'value': '10.1377/hlthaff.2020.02054',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.pmid': [
                {
                  'value': '32451112',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.uri': [
                {
                  'value': 'https://dspacecris7.4science.cloud/handle/123456789/173',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.relation.ispartof': [
                {
                  'value': 'Health Aff (Millwood)',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.title': [
                {
                  'value': 'Clinical Outcomes Of A COVID-19 Vaccine: Implementation Over Efficacy',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.type': [
                {
                  'value': 'Controlled Vocabulary for Resource Type Genres::clinical study',
                  'language': null,
                  'authority': 'types:c_7877',
                  'confidence': 600,
                  'place': 0
                }
              ],
              'dspace.entity.type': [
                {
                  'value': 'Publication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 1
                }
              ]
            },
            'inArchive': true,
            'discoverable': true,
            'withdrawn': false,
            'lastModified': '2021-04-19T20:05:12.677+0000',
            'entityType': 'Publication',
            'type': 'item',
            '_links': {
              'bundles': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/bundles'
              },
              'mappedCollections': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/mappedCollections'
              },
              'owningCollection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/owningCollection'
              },
              'relationships': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/relationships'
              },
              'version': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/version'
              },
              'templateItemOf': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/templateItemOf'
              },
              'metrics': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/metrics'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df'
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df'
          }
        },
        'indexableObject': {
          'handle': '123456789/173',
          'lastModified': '2021-04-19T20:05:12.677+0000',
          'isArchived': true,
          'isDiscoverable': true,
          'isWithdrawn': false,
          '_links': {
            'bundles': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/bundles'
            },
            'mappedCollections': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/mappedCollections'
            },
            'owningCollection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/owningCollection'
            },
            'relationships': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/relationships'
            },
            'version': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/version'
            },
            'templateItemOf': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/templateItemOf'
            },
            'metrics': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df/metrics'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/60067f34-ccd4-4c38-a30d-130a98b391df'
            }
          },
          '_name': 'Clinical Outcomes Of A COVID-19 Vaccine: Implementation Over Efficacy',
          'id': '60067f34-ccd4-4c38-a30d-130a98b391df',
          'uuid': '60067f34-ccd4-4c38-a30d-130a98b391df',
          'type': 'item',
          'metadata': {
            'dc.contributor.author': [
              {
                'uuid': 'e5471d29-0f90-412d-844e-1e411950f973',
                'language': null,
                'value': 'Cortese, Claudio',
                'place': 0,
                'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                'confidence': 600
              },
              {
                'uuid': '54d89f7e-da08-42ee-961e-f81fa1e5f731',
                'language': null,
                'value': 'Bollini, Andrea',
                'place': 1,
                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                'confidence': 600
              }
            ],
            'dc.date.accessioned': [
              {
                'uuid': '70025075-5767-45de-84af-660c2016c685',
                'language': null,
                'value': '2021-04-15T20:20:31Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.available': [
              {
                'uuid': '8131bbc6-e4ba-4ded-adbe-0d71d2d9fb6b',
                'language': null,
                'value': '2021-04-15T20:20:31Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.issued': [
              {
                'uuid': 'aa494d42-8449-47a7-8601-7572d666c12b',
                'language': null,
                'value': '2020-11-09',
                'place': 0,
                'authority': null,
                'confidence': 0
              }
            ],
            'dc.description.provenance': [
              {
                'uuid': '7b75d382-d83e-4d75-b3aa-c24671172eaa',
                'language': 'en',
                'value': 'Made available in DSpace on 2021-04-15T20:20:31Z (GMT). No. of bitstreams: 0  Previous issue date:    9',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.doi': [
              {
                'uuid': '0d2b4d29-18bb-417c-8200-803eb2884cff',
                'language': null,
                'value': '10.1377/hlthaff.2020.02054',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.pmid': [
              {
                'uuid': 'c6891a9c-b284-4bbb-8e3d-90e69f99d56d',
                'language': null,
                'value': '32451112',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.uri': [
              {
                'uuid': 'f93568e2-15cb-4409-b40d-04054bd77878',
                'language': null,
                'value': 'https://dspacecris7.4science.cloud/handle/123456789/173',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.relation.ispartof': [
              {
                'uuid': 'e906b821-2963-4abc-8875-1f45f5e957ca',
                'language': null,
                'value': 'Health Aff (Millwood)',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.title': [
              {
                'uuid': '771247d0-fc12-429b-9632-bb7d45376751',
                'language': null,
                'value': 'Clinical Outcomes Of A COVID-19 Vaccine: Implementation Over Efficacy',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.type': [
              {
                'uuid': '0582808b-ae86-4111-9c9f-875eb611ca52',
                'language': null,
                'value': 'Controlled Vocabulary for Resource Type Genres::clinical study',
                'place': 0,
                'authority': 'types:c_7877',
                'confidence': 600
              }
            ],
            'dspace.entity.type': [
              {
                'uuid': '0b15297b-97d4-4ee4-864b-1ba6c0ae281d',
                'language': null,
                'value': 'Publication',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'oairecerif.author.affiliation': [
              {
                'uuid': '2f5dacf8-063c-45eb-a1b0-d9d86aa8cc0b',
                'language': null,
                'value': '4Science',
                'place': 0,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              },
              {
                'uuid': '39322f4a-3664-498a-8220-2f984a8032ee',
                'language': null,
                'value': '4Science',
                'place': 1,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              }
            ]
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': '457cc4c7-8d1b-4884-ac02-2b8328dcb205',
            'uuid': '457cc4c7-8d1b-4884-ac02-2b8328dcb205',
            'name': 'COVID-19 vaccine testing in pregnant females is necessary',
            'handle': '123456789/158',
            'metadata': {
              'dc.contributor.author': [
                {
                  'value': 'Cortese, Claudio',
                  'language': null,
                  'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 600,
                  'place': 1
                }
              ],
              'dc.date.accessioned': [
                {
                  'value': '2021-04-15T20:20:27Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.available': [
                {
                  'value': '2021-04-15T20:20:27Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.issued': [
                {
                  'value': '2021-01-04',
                  'language': null,
                  'authority': null,
                  'confidence': 0,
                  'place': 0
                }
              ],
              'dc.description.provenance': [
                {
                  'value': 'Made available in DSpace on 2021-04-15T20:20:27Z (GMT). No. of bitstreams: 0  Previous issue date:    4',
                  'language': 'en',
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.doi': [
                {
                  'value': '10.1172/JCI147553',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.pmid': [
                {
                  'value': '33340022',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.uri': [
                {
                  'value': 'https://dspacecris7.4science.cloud/handle/123456789/158',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.relation.ispartof': [
                {
                  'value': 'J Clin Invest',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.title': [
                {
                  'value': 'COVID-19 vaccine testing in pregnant females is necessary',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.type': [
                {
                  'value': 'Controlled Vocabulary for Resource Type Genres::clinical trial',
                  'language': null,
                  'authority': 'types:c_cb28',
                  'confidence': 600,
                  'place': 0
                }
              ],
              'dspace.entity.type': [
                {
                  'value': 'Publication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 1
                }
              ]
            },
            'inArchive': true,
            'discoverable': true,
            'withdrawn': false,
            'lastModified': '2021-04-20T17:21:40.474+0000',
            'entityType': 'Publication',
            'type': 'item',
            '_links': {
              'bundles': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/bundles'
              },
              'mappedCollections': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/mappedCollections'
              },
              'owningCollection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/owningCollection'
              },
              'relationships': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/relationships'
              },
              'version': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/version'
              },
              'templateItemOf': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/templateItemOf'
              },
              'metrics': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/metrics'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205'
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205'
          }
        },
        'indexableObject': {
          'handle': '123456789/158',
          'lastModified': '2021-04-20T17:21:40.474+0000',
          'isArchived': true,
          'isDiscoverable': true,
          'isWithdrawn': false,
          '_links': {
            'bundles': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/bundles'
            },
            'mappedCollections': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/mappedCollections'
            },
            'owningCollection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/owningCollection'
            },
            'relationships': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/relationships'
            },
            'version': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/version'
            },
            'templateItemOf': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/templateItemOf'
            },
            'metrics': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205/metrics'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/457cc4c7-8d1b-4884-ac02-2b8328dcb205'
            }
          },
          '_name': 'COVID-19 vaccine testing in pregnant females is necessary',
          'id': '457cc4c7-8d1b-4884-ac02-2b8328dcb205',
          'uuid': '457cc4c7-8d1b-4884-ac02-2b8328dcb205',
          'type': 'item',
          'metadata': {
            'dc.contributor.author': [
              {
                'uuid': 'f2dc5964-cadc-4d0a-ba39-b19c59629d13',
                'language': null,
                'value': 'Cortese, Claudio',
                'place': 0,
                'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                'confidence': 600
              },
              {
                'uuid': 'b10479f0-276c-4f1e-935b-8825c8e380f6',
                'language': null,
                'value': 'Bollini, Andrea',
                'place': 1,
                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                'confidence': 600
              }
            ],
            'dc.date.accessioned': [
              {
                'uuid': 'ab18b8e9-8d35-44bb-9023-a3f2383ecb8a',
                'language': null,
                'value': '2021-04-15T20:20:27Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.available': [
              {
                'uuid': '1c302111-b56a-424a-91b4-408156c666b5',
                'language': null,
                'value': '2021-04-15T20:20:27Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.issued': [
              {
                'uuid': 'eb861bd6-71ff-4d6e-8de3-c829574b4f46',
                'language': null,
                'value': '2021-01-04',
                'place': 0,
                'authority': null,
                'confidence': 0
              }
            ],
            'dc.description.provenance': [
              {
                'uuid': '2ac22fbd-eb78-40dd-98cd-1cc4f368e7ef',
                'language': 'en',
                'value': 'Made available in DSpace on 2021-04-15T20:20:27Z (GMT). No. of bitstreams: 0  Previous issue date:    4',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.doi': [
              {
                'uuid': 'b1da61c2-ec8f-4ea4-962e-3e0c5c1451a9',
                'language': null,
                'value': '10.1172/JCI147553',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.pmid': [
              {
                'uuid': '8ce93f2c-c392-4e7b-958d-247c52939a1c',
                'language': null,
                'value': '33340022',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.uri': [
              {
                'uuid': '2fd2668f-2b65-4d87-8e17-0a5da7380773',
                'language': null,
                'value': 'https://dspacecris7.4science.cloud/handle/123456789/158',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.relation.ispartof': [
              {
                'uuid': '01291dff-996b-4330-8df0-f4e3fe6cbdda',
                'language': null,
                'value': 'J Clin Invest',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.title': [
              {
                'uuid': '45fb7f71-98a4-4b78-a2d5-ebb365e9b435',
                'language': null,
                'value': 'COVID-19 vaccine testing in pregnant females is necessary',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.type': [
              {
                'uuid': '0b7a2310-981a-41c9-babe-dc51d3b2a053',
                'language': null,
                'value': 'Controlled Vocabulary for Resource Type Genres::clinical trial',
                'place': 0,
                'authority': 'types:c_cb28',
                'confidence': 600
              }
            ],
            'dspace.entity.type': [
              {
                'uuid': '6fff39a0-90b5-457c-b2d7-df00018372d6',
                'language': null,
                'value': 'Publication',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'oairecerif.author.affiliation': [
              {
                'uuid': '0ad0cdef-4f8e-442d-8a7f-cd0547db98c0',
                'language': null,
                'value': '4Science',
                'place': 0,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              },
              {
                'uuid': '9042aad5-cd3d-4de9-b1bc-ce3059985c50',
                'language': null,
                'value': '4Science',
                'place': 1,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              }
            ]
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': 'e6fa5246-53ff-4f06-b3c2-f6cbdc88effe',
            'uuid': 'e6fa5246-53ff-4f06-b3c2-f6cbdc88effe',
            'name': 'A global survey of potential acceptance of a COVID-19 vaccine',
            'handle': '123456789/155',
            'metadata': {
              'dc.contributor.author': [
                {
                  'value': 'Cortese, Claudio',
                  'language': null,
                  'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 600,
                  'place': 1
                }
              ],
              'dc.date.accessioned': [
                {
                  'value': '2021-04-15T20:20:26Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.available': [
                {
                  'value': '2021-04-15T20:20:26Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.issued': [
                {
                  'value': '2020-12-11',
                  'language': null,
                  'authority': null,
                  'confidence': 0,
                  'place': 0
                }
              ],
              'dc.description.provenance': [
                {
                  'value': 'Made available in DSpace on 2021-04-15T20:20:26Z (GMT). No. of bitstreams: 0  Previous issue date:   11',
                  'language': 'en',
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.doi': [
                {
                  'value': '10.1038/s41591-020-1124-9',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.pmid': [
                {
                  'value': '33306990',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.uri': [
                {
                  'value': 'https://dspacecris7.4science.cloud/handle/123456789/155',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.relation.ispartof': [
                {
                  'value': 'Nat Med',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.title': [
                {
                  'value': 'A global survey of potential acceptance of a COVID-19 vaccine',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.type': [
                {
                  'value': 'Controlled Vocabulary for Resource Type Genres::other',
                  'language': null,
                  'authority': 'types:c_1843',
                  'confidence': 600,
                  'place': 0
                }
              ],
              'dspace.entity.type': [
                {
                  'value': 'Publication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 1
                }
              ]
            },
            'inArchive': true,
            'discoverable': true,
            'withdrawn': false,
            'lastModified': '2021-04-19T20:11:54.884+0000',
            'entityType': 'Publication',
            'type': 'item',
            '_links': {
              'bundles': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/bundles'
              },
              'mappedCollections': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/mappedCollections'
              },
              'owningCollection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/owningCollection'
              },
              'relationships': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/relationships'
              },
              'version': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/version'
              },
              'templateItemOf': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/templateItemOf'
              },
              'metrics': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/metrics'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe'
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe'
          }
        },
        'indexableObject': {
          'handle': '123456789/155',
          'lastModified': '2021-04-19T20:11:54.884+0000',
          'isArchived': true,
          'isDiscoverable': true,
          'isWithdrawn': false,
          '_links': {
            'bundles': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/bundles'
            },
            'mappedCollections': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/mappedCollections'
            },
            'owningCollection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/owningCollection'
            },
            'relationships': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/relationships'
            },
            'version': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/version'
            },
            'templateItemOf': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/templateItemOf'
            },
            'metrics': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe/metrics'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/e6fa5246-53ff-4f06-b3c2-f6cbdc88effe'
            }
          },
          '_name': 'A global survey of potential acceptance of a COVID-19 vaccine',
          'id': 'e6fa5246-53ff-4f06-b3c2-f6cbdc88effe',
          'uuid': 'e6fa5246-53ff-4f06-b3c2-f6cbdc88effe',
          'type': 'item',
          'metadata': {
            'dc.contributor.author': [
              {
                'uuid': '0834dff8-a853-466c-8fdd-1972bb9acdc8',
                'language': null,
                'value': 'Cortese, Claudio',
                'place': 0,
                'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                'confidence': 600
              },
              {
                'uuid': 'd4a64323-52ce-49e0-9123-5c339592e25e',
                'language': null,
                'value': 'Bollini, Andrea',
                'place': 1,
                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                'confidence': 600
              }
            ],
            'dc.date.accessioned': [
              {
                'uuid': '7bf5d2c3-117a-4c70-aa77-2e90dfb8ffde',
                'language': null,
                'value': '2021-04-15T20:20:26Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.available': [
              {
                'uuid': 'a3bbf2bc-0941-49d3-ae31-f17c1680e519',
                'language': null,
                'value': '2021-04-15T20:20:26Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.issued': [
              {
                'uuid': 'a210a9ec-8a95-4b1b-b1a9-fa74df59d010',
                'language': null,
                'value': '2020-12-11',
                'place': 0,
                'authority': null,
                'confidence': 0
              }
            ],
            'dc.description.provenance': [
              {
                'uuid': '8e12b2e1-2083-4190-93d3-fd0625c2b436',
                'language': 'en',
                'value': 'Made available in DSpace on 2021-04-15T20:20:26Z (GMT). No. of bitstreams: 0  Previous issue date:   11',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.doi': [
              {
                'uuid': '64807076-cfa9-48c9-99f5-0179cfcc5c23',
                'language': null,
                'value': '10.1038/s41591-020-1124-9',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.pmid': [
              {
                'uuid': '201e817f-eb53-4408-8fb4-a705bc771e50',
                'language': null,
                'value': '33306990',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.uri': [
              {
                'uuid': 'e44b1e55-dc16-4dae-866a-a1c98bf56a43',
                'language': null,
                'value': 'https://dspacecris7.4science.cloud/handle/123456789/155',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.relation.ispartof': [
              {
                'uuid': 'eea0cb6d-f88a-43d1-8640-aff56e088bc8',
                'language': null,
                'value': 'Nat Med',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.title': [
              {
                'uuid': '53dda336-b776-47b0-97d5-5aa1d4faebc0',
                'language': null,
                'value': 'A global survey of potential acceptance of a COVID-19 vaccine',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.type': [
              {
                'uuid': '88cafb96-6362-46ac-a2fb-e6a370f55f88',
                'language': null,
                'value': 'Controlled Vocabulary for Resource Type Genres::other',
                'place': 0,
                'authority': 'types:c_1843',
                'confidence': 600
              }
            ],
            'dspace.entity.type': [
              {
                'uuid': '876b0f39-c9b9-4568-b1fd-b4eb739062eb',
                'language': null,
                'value': 'Publication',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'oairecerif.author.affiliation': [
              {
                'uuid': '4bb68471-9660-4117-bd50-afded2069b5b',
                'language': null,
                'value': '4Science',
                'place': 0,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              },
              {
                'uuid': '3c0a55f4-7848-4bc2-8139-1c3875e25483',
                'language': null,
                'value': '4Science',
                'place': 1,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              }
            ]
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': 'daf8587e-724e-4399-bc47-006bfa10fd2c',
            'uuid': 'daf8587e-724e-4399-bc47-006bfa10fd2c',
            'name': 'Building a Semantic Web Digital Library for the Municipality of Milan',
            'handle': '123456789/188',
            'metadata': {
              'dc.contributor.author': [
                {
                  'value': 'Cortese, Claudio',
                  'language': null,
                  'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 600,
                  'place': 1
                }
              ],
              'dc.date.accessioned': [
                {
                  'value': '2021-04-15T21:39:12Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.available': [
                {
                  'value': '2021-04-15T21:39:12Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.issued': [
                {
                  'value': '2018',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.description.provenance': [
                {
                  'value': 'Made available in DSpace on 2021-04-15T21:39:12Z (GMT). No. of bitstreams: 0  Previous issue date: 2018',
                  'language': 'en',
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.uri': [
                {
                  'value': 'https://dspacecris7.4science.cloud/handle/123456789/188',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.title': [
                {
                  'value': 'Building a Semantic Web Digital Library for the Municipality of Milan',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.type': [
                {
                  'value': 'Controlled Vocabulary for Resource Type Genres::other',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dspace.entity.type': [
                {
                  'value': 'Publication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 1
                }
              ]
            },
            'inArchive': true,
            'discoverable': true,
            'withdrawn': false,
            'lastModified': '2021-04-19T20:11:58.272+0000',
            'entityType': 'Publication',
            'type': 'item',
            '_links': {
              'bundles': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/bundles'
              },
              'mappedCollections': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/mappedCollections'
              },
              'owningCollection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/owningCollection'
              },
              'relationships': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/relationships'
              },
              'version': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/version'
              },
              'templateItemOf': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/templateItemOf'
              },
              'metrics': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/metrics'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c'
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c'
          }
        },
        'indexableObject': {
          'handle': '123456789/188',
          'lastModified': '2021-04-19T20:11:58.272+0000',
          'isArchived': true,
          'isDiscoverable': true,
          'isWithdrawn': false,
          '_links': {
            'bundles': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/bundles'
            },
            'mappedCollections': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/mappedCollections'
            },
            'owningCollection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/owningCollection'
            },
            'relationships': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/relationships'
            },
            'version': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/version'
            },
            'templateItemOf': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/templateItemOf'
            },
            'metrics': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c/metrics'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/daf8587e-724e-4399-bc47-006bfa10fd2c'
            }
          },
          '_name': 'Building a Semantic Web Digital Library for the Municipality of Milan',
          'id': 'daf8587e-724e-4399-bc47-006bfa10fd2c',
          'uuid': 'daf8587e-724e-4399-bc47-006bfa10fd2c',
          'type': 'item',
          'metadata': {
            'dc.contributor.author': [
              {
                'uuid': 'a966ba9f-e58e-47c4-a983-bcfa0c5693d2',
                'language': null,
                'value': 'Cortese, Claudio',
                'place': 0,
                'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                'confidence': 600
              },
              {
                'uuid': 'd52fab22-af3f-48a9-bad7-6ee11ef511ae',
                'language': null,
                'value': 'Bollini, Andrea',
                'place': 1,
                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                'confidence': 600
              }
            ],
            'dc.date.accessioned': [
              {
                'uuid': 'b51e11ed-9a77-4202-8826-df082589b733',
                'language': null,
                'value': '2021-04-15T21:39:12Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.available': [
              {
                'uuid': '714ca3c0-56b8-4e3b-afa3-6fc5410fc557',
                'language': null,
                'value': '2021-04-15T21:39:12Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.issued': [
              {
                'uuid': '91027945-81fb-49f8-95aa-708087f38fef',
                'language': null,
                'value': '2018',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.description.provenance': [
              {
                'uuid': '5c35b2d0-c78a-4896-a7b0-f887a36a44ec',
                'language': 'en',
                'value': 'Made available in DSpace on 2021-04-15T21:39:12Z (GMT). No. of bitstreams: 0  Previous issue date: 2018',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.uri': [
              {
                'uuid': 'bebd2000-c130-4624-9ce2-b0d5d3e5533f',
                'language': null,
                'value': 'https://dspacecris7.4science.cloud/handle/123456789/188',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.title': [
              {
                'uuid': '31a5b124-f598-412d-aee0-7284e702d629',
                'language': null,
                'value': 'Building a Semantic Web Digital Library for the Municipality of Milan',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.type': [
              {
                'uuid': 'd5d6e2a6-b814-49e2-aeeb-4232978fe4b1',
                'language': null,
                'value': 'Controlled Vocabulary for Resource Type Genres::other',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dspace.entity.type': [
              {
                'uuid': 'b8ca5b6c-6ee1-4ad0-9e41-659bc5b5501a',
                'language': null,
                'value': 'Publication',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'oairecerif.author.affiliation': [
              {
                'uuid': '9e951183-64fe-429e-abdf-c49844e2bb59',
                'language': null,
                'value': '4Science',
                'place': 0,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              },
              {
                'uuid': '4e442625-9ace-4ec0-b509-d962f48ae188',
                'language': null,
                'value': '4Science',
                'place': 1,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              }
            ]
          }
        }
      },
      {
        'type': {
          'value': 'searchresult'
        },
        'hitHighlights': {},
        '_embedded': {
          'indexableObject': {
            'id': '70403a07-1915-4b2c-aaf2-174b32be3634',
            'uuid': '70403a07-1915-4b2c-aaf2-174b32be3634',
            'name': 'COVID-19 vaccine development: What lessons can we learn from TB?',
            'handle': '123456789/164',
            'metadata': {
              'dc.contributor.author': [
                {
                  'value': 'Cortese, Claudio',
                  'language': null,
                  'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': 'Bollini, Andrea',
                  'language': null,
                  'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                  'confidence': 600,
                  'place': 1
                }
              ],
              'dc.date.accessioned': [
                {
                  'value': '2021-04-15T20:20:28Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.available': [
                {
                  'value': '2021-04-15T20:20:28Z',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.date.issued': [
                {
                  'value': '2021-02-01',
                  'language': null,
                  'authority': null,
                  'confidence': 0,
                  'place': 0
                }
              ],
              'dc.description.provenance': [
                {
                  'value': 'Made available in DSpace on 2021-04-15T20:20:28Z (GMT). No. of bitstreams: 0  Previous issue date:    1',
                  'language': 'en',
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.doi': [
                {
                  'value': '10.1186/s12941-020-00402-x',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.pmid': [
                {
                  'value': '32893468',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.identifier.uri': [
                {
                  'value': 'https://dspacecris7.4science.cloud/handle/123456789/164',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.relation.ispartof': [
                {
                  'value': 'Ann Clin Microbiol Antimicrob',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.title': [
                {
                  'value': 'COVID-19 vaccine development: What lessons can we learn from TB?',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'dc.type': [
                {
                  'value': 'Controlled Vocabulary for Resource Type Genres::other',
                  'language': null,
                  'authority': 'types:c_1843',
                  'confidence': 600,
                  'place': 0
                }
              ],
              'dspace.entity.type': [
                {
                  'value': 'Publication',
                  'language': null,
                  'authority': null,
                  'confidence': -1,
                  'place': 0
                }
              ],
              'oairecerif.author.affiliation': [
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 0
                },
                {
                  'value': '4Science',
                  'language': null,
                  'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                  'confidence': 600,
                  'place': 1
                }
              ]
            },
            'inArchive': true,
            'discoverable': true,
            'withdrawn': false,
            'lastModified': '2021-04-20T17:26:31.371+0000',
            'entityType': 'Publication',
            'type': 'item',
            '_links': {
              'bundles': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/bundles'
              },
              'mappedCollections': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/mappedCollections'
              },
              'owningCollection': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/owningCollection'
              },
              'relationships': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/relationships'
              },
              'version': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/version'
              },
              'templateItemOf': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/templateItemOf'
              },
              'metrics': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/metrics'
              },
              'self': {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634'
              }
            }
          }
        },
        '_links': {
          'indexableObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634'
          }
        },
        'indexableObject': {
          'handle': '123456789/164',
          'lastModified': '2021-04-20T17:26:31.371+0000',
          'isArchived': true,
          'isDiscoverable': true,
          'isWithdrawn': false,
          '_links': {
            'bundles': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/bundles'
            },
            'mappedCollections': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/mappedCollections'
            },
            'owningCollection': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/owningCollection'
            },
            'relationships': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/relationships'
            },
            'version': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/version'
            },
            'templateItemOf': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/templateItemOf'
            },
            'metrics': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634/metrics'
            },
            'self': {
              'href': 'https://dspacecris7.4science.cloud/server/api/core/items/70403a07-1915-4b2c-aaf2-174b32be3634'
            }
          },
          '_name': 'COVID-19 vaccine development: What lessons can we learn from TB?',
          'id': '70403a07-1915-4b2c-aaf2-174b32be3634',
          'uuid': '70403a07-1915-4b2c-aaf2-174b32be3634',
          'type': 'item',
          'metadata': {
            'dc.contributor.author': [
              {
                'uuid': 'ff1667b9-01c2-4a7c-a21b-127e1d8e1612',
                'language': null,
                'value': 'Cortese, Claudio',
                'place': 0,
                'authority': 'b14b8d90-fba7-4678-8153-46017a38a218',
                'confidence': 600
              },
              {
                'uuid': '888ac22d-7b42-449c-872b-b458f8757003',
                'language': null,
                'value': 'Bollini, Andrea',
                'place': 1,
                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                'confidence': 600
              }
            ],
            'dc.date.accessioned': [
              {
                'uuid': 'f46d2010-cc48-4409-8b93-9374d526bddc',
                'language': null,
                'value': '2021-04-15T20:20:28Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.available': [
              {
                'uuid': '81b44848-6173-4ad2-a68a-072c650aac9c',
                'language': null,
                'value': '2021-04-15T20:20:28Z',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.date.issued': [
              {
                'uuid': '580dde82-2826-4ec8-8713-15c1c5d69e38',
                'language': null,
                'value': '2021-02-01',
                'place': 0,
                'authority': null,
                'confidence': 0
              }
            ],
            'dc.description.provenance': [
              {
                'uuid': '72e66a02-7598-4f79-a7b1-e8833594761a',
                'language': 'en',
                'value': 'Made available in DSpace on 2021-04-15T20:20:28Z (GMT). No. of bitstreams: 0  Previous issue date:    1',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.doi': [
              {
                'uuid': 'c8328c5c-6778-4c37-825e-3551910a4f3a',
                'language': null,
                'value': '10.1186/s12941-020-00402-x',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.pmid': [
              {
                'uuid': 'fee2dd57-ed68-4196-b7d9-f35b3a365980',
                'language': null,
                'value': '32893468',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.identifier.uri': [
              {
                'uuid': '86f3cefc-afb9-4442-ad03-809a4645cbaa',
                'language': null,
                'value': 'https://dspacecris7.4science.cloud/handle/123456789/164',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.relation.ispartof': [
              {
                'uuid': 'fa9494ad-eb7b-454d-b8a9-aa192976e013',
                'language': null,
                'value': 'Ann Clin Microbiol Antimicrob',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.title': [
              {
                'uuid': 'c41c8912-3eb4-4f83-95bb-6169ca6b8d1a',
                'language': null,
                'value': 'COVID-19 vaccine development: What lessons can we learn from TB?',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'dc.type': [
              {
                'uuid': '64d35ae3-c520-4379-a59b-d51bee5773c7',
                'language': null,
                'value': 'Controlled Vocabulary for Resource Type Genres::other',
                'place': 0,
                'authority': 'types:c_1843',
                'confidence': 600
              }
            ],
            'dspace.entity.type': [
              {
                'uuid': 'c3000075-4e61-4ba2-869e-39716e4e9477',
                'language': null,
                'value': 'Publication',
                'place': 0,
                'authority': null,
                'confidence': -1
              }
            ],
            'oairecerif.author.affiliation': [
              {
                'uuid': 'fda205a6-04f5-41ab-9129-321969bc103c',
                'language': null,
                'value': '4Science',
                'place': 0,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              },
              {
                'uuid': '371f1bce-dce0-45fd-b994-29e5a7cc30ed',
                'language': null,
                'value': '4Science',
                'place': 1,
                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                'confidence': 600
              }
            ]
          }
        }
      }
    ],
    'scope': '092b59e8-8159-4e70-98b5-93ec60bd3431',
    'appliedFilters': null,
    'sort': {
      'by': 'score',
      'order': 'DESC'
    },
    'configuration': 'RELATION.Person.researchoutputs',
    '_links': {
      'next': {
        'href': 'https://dspacecris7.4science.cloud/server/api/discover/search/objects?scope=092b59e8-8159-4e70-98b5-93ec60bd3431&configuration=RELATION.Person.researchoutputs&sort=score,DESC&page=1&size=10'
      },
      'last': {
        'href': 'https://dspacecris7.4science.cloud/server/api/discover/search/objects?scope=092b59e8-8159-4e70-98b5-93ec60bd3431&configuration=RELATION.Person.researchoutputs&sort=score,DESC&page=3&size=10'
      },
      'self': {
        'href': 'https://dspacecris7.4science.cloud/server/api/discover/search/objects?scope=092b59e8-8159-4e70-98b5-93ec60bd3431&configuration=RELATION.Person.researchoutputs&sort=score,DESC'
      }
    },
    'pageInfo': {
      'elementsPerPage': 10,
      'totalElements': 39,
      'totalPages': 4,
      'currentPage': 1
    }
  },
  'statusCode': 200
};
