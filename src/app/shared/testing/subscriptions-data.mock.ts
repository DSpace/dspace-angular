export const findAllSubscriptionRes = {
    'type': {
        'value': 'paginated-list'
    },
    'pageInfo': {
        'elementsPerPage': 10,
        'totalElements': 10,
        'totalPages': 1,
        'currentPage': 1
    },
    '_links': {
        'self': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions?page=0&size=10'
        },
        'search': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/search'
        },
        'page': [
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/21'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/23'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/24'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/25'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/26'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/27'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/30'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/31'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/32'
            }
        ]
    },
    'page': [
        {
            'id': 21,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 77,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 78,
                    'name': 'frequency',
                    'value': 'M'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/21/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/21/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/21'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'uuid': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'name': 'Bollini, Andrea',
                    'handle': '123456789/43',
                    'metadata': {
                        'creativework.datePublished': [
                            {
                                'value': null,
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.access-token': [
                            {
                                'value': 'a456a1c3-1c9e-45f8-9e11-f273fa58de2e',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.authenticated': [
                            {
                                'value': 'true',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.refresh-token': [
                            {
                                'value': '13a63f03-7c49-4dad-b39b-070f73cc7ac1',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.scope': [
                            {
                                'value': '/authenticate',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '/read-limited',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '/activities/update',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            },
                            {
                                'value': '/person/update',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 3,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-fundings': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-mode': [
                            {
                                'value': 'MANUAL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-profile': [
                            {
                                'value': 'AFFILIATION',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'EDUCATION',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'BIOGRAPHICAL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            },
                            {
                                'value': 'IDENTIFIERS',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 3,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-projects': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-publications': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.webhook': [
                            {
                                'value': '2021-05-26T12:47:27.971367',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.owner': [
                            {
                                'value': 'Demo Site Administrator',
                                'language': null,
                                'authority': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                                'confidence': 600,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.policy.group': [
                            {
                                'value': 'Administrator',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.sourceId': [
                            {
                                'value': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.workspace.shared': [
                            {
                                'value': 'fg',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.country': [
                            {
                                'value': 'IT',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education': [
                            {
                                'value': 'Università degli Studi di Milano Bicocca',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Sapienza Università di Roma',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.end': [
                            {
                                'value': '2008',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2003',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.role': [
                            {
                                'value': 'Master post experience 2nd level',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Graduate Studies - Mathematics, Physics',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.start': [
                            {
                                'value': '2007',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '1998',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.name.translated': [
                            {
                                'value': null,
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.site.title': [
                            {
                                'value': 'LinkedIn',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'GitHub',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'dc.date.accessioned': [
                            {
                                'value': '2020-09-14T09:36:02Z',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-09-14T09:36:02Z',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'I’m responsible for all the technological aspects of the company proposal, from the final solutions to tools, methodologies and technologies adopted for the production and support activities. Among my responsibilities, I define the infrastructure that best fits the project requirements. We provide support on premis on the customer data center and worldwide cloud providers. Our hosted solutions are powered by Amazon Web Services, our experience in their services allow us to offer best in class solutions, scalable and cost-optimized.\n\nI’m in charge of the planning, estimation and execution of the projects from the technical perspective, and of the preparation of technical annexes for national and international tenders.\n\nI lead the teams of software architects and developers, assuring the adoption of best practices and up-to-date technologies. I’m in charge of the scouting and integration of new technologies and products within our solutions with a particular focus on Open Source and Open Standards. I’m directly involved with open-source and domain communities to assure that our solutions remain aligned with the international trends both from the technical perspective and for the functional requirements.',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-09-14T09:36:02Z (GMT). No. of bitstreams: 0',
                                'language': 'en',
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/43',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'Bollini, Andrea',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dspace.entity.type': [
                            {
                                'value': 'Person',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.endDate': [
                            {
                                'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.role': [
                            {
                                'value': 'CTO',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Head of Open Source & Open Standards Strategy',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Head of Open Source & Open Standards Strategy',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.startDate': [
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2012',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '2012',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.identifier.url': [
                            {
                                'value': 'https://www.linkedin.com/in/andreabollini/',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'https://github.com/abollini',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.person.affiliation': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'CINECA',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'CINECA',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.person.gender': [
                            {
                                'value': 'm',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.affiliation.name': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.email': [
                            {
                                'value': 'andrea.bollini@4science.it',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.familyName': [
                            {
                                'value': 'Bollini',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.givenName': [
                            {
                                'value': 'Andrea',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.identifier.orcid': [
                            {
                                'value': '0000-0003-0864-8867',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.identifier.scopus-author-id': [
                            {
                                'value': '55484808800',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.jobTitle': [
                            {
                                'value': 'CTO',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.knowsLanguage': [
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-08-23T10:44:57.768+00:00',
                    'entityType': 'Person',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 22,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 138,
                    'name': 'frequency',
                    'value': 'D'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'uuid': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'name': 'Bollini, Andrea',
                    'handle': '123456789/43',
                    'metadata': {
                        'creativework.datePublished': [
                            {
                                'value': null,
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.access-token': [
                            {
                                'value': 'a456a1c3-1c9e-45f8-9e11-f273fa58de2e',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.authenticated': [
                            {
                                'value': 'true',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.refresh-token': [
                            {
                                'value': '13a63f03-7c49-4dad-b39b-070f73cc7ac1',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.scope': [
                            {
                                'value': '/authenticate',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '/read-limited',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '/activities/update',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            },
                            {
                                'value': '/person/update',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 3,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-fundings': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-mode': [
                            {
                                'value': 'MANUAL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-profile': [
                            {
                                'value': 'AFFILIATION',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'EDUCATION',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'BIOGRAPHICAL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            },
                            {
                                'value': 'IDENTIFIERS',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 3,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-projects': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-publications': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.webhook': [
                            {
                                'value': '2021-05-26T12:47:27.971367',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.owner': [
                            {
                                'value': 'Demo Site Administrator',
                                'language': null,
                                'authority': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                                'confidence': 600,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.policy.group': [
                            {
                                'value': 'Administrator',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.sourceId': [
                            {
                                'value': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.workspace.shared': [
                            {
                                'value': 'fg',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.country': [
                            {
                                'value': 'IT',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education': [
                            {
                                'value': 'Università degli Studi di Milano Bicocca',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Sapienza Università di Roma',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.end': [
                            {
                                'value': '2008',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2003',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.role': [
                            {
                                'value': 'Master post experience 2nd level',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Graduate Studies - Mathematics, Physics',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.start': [
                            {
                                'value': '2007',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '1998',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.name.translated': [
                            {
                                'value': null,
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.site.title': [
                            {
                                'value': 'LinkedIn',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'GitHub',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'dc.date.accessioned': [
                            {
                                'value': '2020-09-14T09:36:02Z',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-09-14T09:36:02Z',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'I’m responsible for all the technological aspects of the company proposal, from the final solutions to tools, methodologies and technologies adopted for the production and support activities. Among my responsibilities, I define the infrastructure that best fits the project requirements. We provide support on premis on the customer data center and worldwide cloud providers. Our hosted solutions are powered by Amazon Web Services, our experience in their services allow us to offer best in class solutions, scalable and cost-optimized.\n\nI’m in charge of the planning, estimation and execution of the projects from the technical perspective, and of the preparation of technical annexes for national and international tenders.\n\nI lead the teams of software architects and developers, assuring the adoption of best practices and up-to-date technologies. I’m in charge of the scouting and integration of new technologies and products within our solutions with a particular focus on Open Source and Open Standards. I’m directly involved with open-source and domain communities to assure that our solutions remain aligned with the international trends both from the technical perspective and for the functional requirements.',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-09-14T09:36:02Z (GMT). No. of bitstreams: 0',
                                'language': 'en',
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/43',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'Bollini, Andrea',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dspace.entity.type': [
                            {
                                'value': 'Person',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.endDate': [
                            {
                                'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.role': [
                            {
                                'value': 'CTO',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Head of Open Source & Open Standards Strategy',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Head of Open Source & Open Standards Strategy',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.startDate': [
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2012',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '2012',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.identifier.url': [
                            {
                                'value': 'https://www.linkedin.com/in/andreabollini/',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'https://github.com/abollini',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.person.affiliation': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'CINECA',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'CINECA',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.person.gender': [
                            {
                                'value': 'm',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.affiliation.name': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.email': [
                            {
                                'value': 'andrea.bollini@4science.it',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.familyName': [
                            {
                                'value': 'Bollini',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.givenName': [
                            {
                                'value': 'Andrea',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.identifier.orcid': [
                            {
                                'value': '0000-0003-0864-8867',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.identifier.scopus-author-id': [
                            {
                                'value': '55484808800',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.jobTitle': [
                            {
                                'value': 'CTO',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.knowsLanguage': [
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-08-23T10:44:57.768+00:00',
                    'entityType': 'Person',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 23,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 80,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 81,
                    'name': 'frequency',
                    'value': 'M'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/23/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/23/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/23'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'uuid': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                    'name': 'Bollini, Andrea',
                    'handle': '123456789/43',
                    'metadata': {
                        'creativework.datePublished': [
                            {
                                'value': null,
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.access-token': [
                            {
                                'value': 'a456a1c3-1c9e-45f8-9e11-f273fa58de2e',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.authenticated': [
                            {
                                'value': 'true',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.refresh-token': [
                            {
                                'value': '13a63f03-7c49-4dad-b39b-070f73cc7ac1',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.scope': [
                            {
                                'value': '/authenticate',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '/read-limited',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '/activities/update',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            },
                            {
                                'value': '/person/update',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 3,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-fundings': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-mode': [
                            {
                                'value': 'MANUAL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-profile': [
                            {
                                'value': 'AFFILIATION',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'EDUCATION',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'BIOGRAPHICAL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            },
                            {
                                'value': 'IDENTIFIERS',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 3,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-projects': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.sync-publications': [
                            {
                                'value': 'ALL',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.orcid.webhook': [
                            {
                                'value': '2021-05-26T12:47:27.971367',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.owner': [
                            {
                                'value': 'Demo Site Administrator',
                                'language': null,
                                'authority': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                                'confidence': 600,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.policy.group': [
                            {
                                'value': 'Administrator',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.sourceId': [
                            {
                                'value': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'cris.workspace.shared': [
                            {
                                'value': 'fg',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.country': [
                            {
                                'value': 'IT',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education': [
                            {
                                'value': 'Università degli Studi di Milano Bicocca',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Sapienza Università di Roma',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.end': [
                            {
                                'value': '2008',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2003',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.role': [
                            {
                                'value': 'Master post experience 2nd level',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Graduate Studies - Mathematics, Physics',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.education.start': [
                            {
                                'value': '2007',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '1998',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.name.translated': [
                            {
                                'value': null,
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'crisrp.site.title': [
                            {
                                'value': 'LinkedIn',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'GitHub',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'dc.date.accessioned': [
                            {
                                'value': '2020-09-14T09:36:02Z',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-09-14T09:36:02Z',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'I’m responsible for all the technological aspects of the company proposal, from the final solutions to tools, methodologies and technologies adopted for the production and support activities. Among my responsibilities, I define the infrastructure that best fits the project requirements. We provide support on premis on the customer data center and worldwide cloud providers. Our hosted solutions are powered by Amazon Web Services, our experience in their services allow us to offer best in class solutions, scalable and cost-optimized.\n\nI’m in charge of the planning, estimation and execution of the projects from the technical perspective, and of the preparation of technical annexes for national and international tenders.\n\nI lead the teams of software architects and developers, assuring the adoption of best practices and up-to-date technologies. I’m in charge of the scouting and integration of new technologies and products within our solutions with a particular focus on Open Source and Open Standards. I’m directly involved with open-source and domain communities to assure that our solutions remain aligned with the international trends both from the technical perspective and for the functional requirements.',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-09-14T09:36:02Z (GMT). No. of bitstreams: 0',
                                'language': 'en',
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/43',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'Bollini, Andrea',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'dspace.entity.type': [
                            {
                                'value': 'Person',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.endDate': [
                            {
                                'value': '#PLACEHOLDER_PARENT_METADATA_VALUE#',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.role': [
                            {
                                'value': 'CTO',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Head of Open Source & Open Standards Strategy',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'Head of Open Source & Open Standards Strategy',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.affiliation.startDate': [
                            {
                                'value': '2016',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': '2012',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': '2012',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.identifier.url': [
                            {
                                'value': 'https://www.linkedin.com/in/andreabollini/',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'https://github.com/abollini',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.person.affiliation': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'CINECA',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            },
                            {
                                'value': 'CINECA',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 2,
                                'securityLevel': 0
                            }
                        ],
                        'oairecerif.person.gender': [
                            {
                                'value': 'm',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.affiliation.name': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.email': [
                            {
                                'value': 'andrea.bollini@4science.it',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.familyName': [
                            {
                                'value': 'Bollini',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.givenName': [
                            {
                                'value': 'Andrea',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.identifier.orcid': [
                            {
                                'value': '0000-0003-0864-8867',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.identifier.scopus-author-id': [
                            {
                                'value': '55484808800',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.jobTitle': [
                            {
                                'value': 'CTO',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            }
                        ],
                        'person.knowsLanguage': [
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 0,
                                'securityLevel': 0
                            },
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': 0,
                                'place': 1,
                                'securityLevel': 0
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-08-23T10:44:57.768+00:00',
                    'entityType': 'Person',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/092b59e8-8159-4e70-98b5-93ec60bd3431'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 24,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 82,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 83,
                    'name': 'frequency',
                    'value': 'M'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/24/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/24/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/24'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'uuid': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'name': 'DSpace-CRIS',
                    'handle': '123456789/34',
                    'metadata': {
                        'crispj.coinvestigators': [
                            {
                                'value': 'Mornati, Susanna',
                                'language': null,
                                'authority': '1325093a-1ef4-4d87-920d-02ce544fea00',
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
                        'crispj.coordinator': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'crispj.investigator': [
                            {
                                'value': 'Bollini, Andrea',
                                'language': null,
                                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'dc.date.accessioned': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'DSpace-CRIS is the first free open-source extension of DSpace for the Research Data and Information Management ever developed. Differently from other (commercial) CRIS/RIMS (star), DSpace-CRIS has the institutional repository as its core component, providing high visibility on the web to all the collected information and objects. DSpace-CRIS broadens DSpace functionality and expands its data model while remaining aligned with its code base. \n\nDSpace-CRIS adopts/is compliant with international standards and practices to facilitate interoperability and data transfer:\n\n- ORCID API v2 (complete compliance including pull/push of info for profiles, publications, projects). ORCID API v3 compliance is being released.\n\n- Signposting and ResourceSync (which implement COAR NGR Recommended Behaviors)\n\n- OpenAIRE Guidelines for Literature Repository Managers v4, for Data Archives, for CRIS Managers v1.1.1 (based on CERIF, released Nov. 2019)\n\n- PlanS (by Coalition S)\n\n- FAIR principles\n\nThe main characteristic of DSpace-CRIS is its flexible data model, which allows you to collect and manage research data and information typical of a CRIS system, to define entities and attributes with their reciprocal links. If you would just want to enhance the management of authors, provide name variants and IDs such as the ORCiD, exploit the varied ecosystem of persistent identifiers, link researchers to projects, awards, etc., DSpace-CRIS flexible data model can support this without aggravating the management burden of a normal institutional repository, while giving a great added value. Besides, it has useful features such as the collaboration network graph, aggregated (by researcher, by department) bibliometrics and statistics with graphic reporting, CVs and bibliographies, integration with ORCiD API v.3 and much more, you can explore them vie the menu items here on the left. \n\nIts flexibility allows to configure different data models and metadata schemas, providing the community with new and creative uses of DSpace, such as DSpace-GLAM (Galleries, Libraries, Archives and Museums) for the Cultural Heritage.',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-09-05T16:33:33Z (GMT). No. of bitstreams: 1\nlayers.png: 295537 bytes, checksum: 001e24b05d2c5d6cd76e88580f10cb9b (MD5)',
                                'language': 'en',
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/34',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.subject': [
                            {
                                'value': 'cerif',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            },
                            {
                                'value': 'datamanagement',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 1
                            },
                            {
                                'value': 'opensource',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 2
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'DSpace-CRIS',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.type': [
                            {
                                'value': 'applied research',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dspace.entity.type': [
                            {
                                'value': 'Project',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.acronym': [
                            {
                                'value': 'DSC',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate': [
                            {
                                'value': 'true',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate.url': [
                            {
                                'value': 'https://www.4science.it/en/open-source/',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.startDate': [
                            {
                                'value': '2009-04',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.status': [
                            {
                                'value': 'ongoing',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-08-02T14:19:24.927+00:00',
                    'entityType': 'Project',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 25,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 84,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 85,
                    'name': 'frequency',
                    'value': 'M'
                },
                {
                    'id': 86,
                    'name': 'frequency',
                    'value': 'W'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/25/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/25/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/25'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'uuid': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'name': 'DSpace-CRIS',
                    'handle': '123456789/34',
                    'metadata': {
                        'crispj.coinvestigators': [
                            {
                                'value': 'Mornati, Susanna',
                                'language': null,
                                'authority': '1325093a-1ef4-4d87-920d-02ce544fea00',
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
                        'crispj.coordinator': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'crispj.investigator': [
                            {
                                'value': 'Bollini, Andrea',
                                'language': null,
                                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'dc.date.accessioned': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'DSpace-CRIS is the first free open-source extension of DSpace for the Research Data and Information Management ever developed. Differently from other (commercial) CRIS/RIMS (star), DSpace-CRIS has the institutional repository as its core component, providing high visibility on the web to all the collected information and objects. DSpace-CRIS broadens DSpace functionality and expands its data model while remaining aligned with its code base. \n\nDSpace-CRIS adopts/is compliant with international standards and practices to facilitate interoperability and data transfer:\n\n- ORCID API v2 (complete compliance including pull/push of info for profiles, publications, projects). ORCID API v3 compliance is being released.\n\n- Signposting and ResourceSync (which implement COAR NGR Recommended Behaviors)\n\n- OpenAIRE Guidelines for Literature Repository Managers v4, for Data Archives, for CRIS Managers v1.1.1 (based on CERIF, released Nov. 2019)\n\n- PlanS (by Coalition S)\n\n- FAIR principles\n\nThe main characteristic of DSpace-CRIS is its flexible data model, which allows you to collect and manage research data and information typical of a CRIS system, to define entities and attributes with their reciprocal links. If you would just want to enhance the management of authors, provide name variants and IDs such as the ORCiD, exploit the varied ecosystem of persistent identifiers, link researchers to projects, awards, etc., DSpace-CRIS flexible data model can support this without aggravating the management burden of a normal institutional repository, while giving a great added value. Besides, it has useful features such as the collaboration network graph, aggregated (by researcher, by department) bibliometrics and statistics with graphic reporting, CVs and bibliographies, integration with ORCiD API v.3 and much more, you can explore them vie the menu items here on the left. \n\nIts flexibility allows to configure different data models and metadata schemas, providing the community with new and creative uses of DSpace, such as DSpace-GLAM (Galleries, Libraries, Archives and Museums) for the Cultural Heritage.',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-09-05T16:33:33Z (GMT). No. of bitstreams: 1\nlayers.png: 295537 bytes, checksum: 001e24b05d2c5d6cd76e88580f10cb9b (MD5)',
                                'language': 'en',
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/34',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.subject': [
                            {
                                'value': 'cerif',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            },
                            {
                                'value': 'datamanagement',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 1
                            },
                            {
                                'value': 'opensource',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 2
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'DSpace-CRIS',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.type': [
                            {
                                'value': 'applied research',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dspace.entity.type': [
                            {
                                'value': 'Project',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.acronym': [
                            {
                                'value': 'DSC',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate': [
                            {
                                'value': 'true',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate.url': [
                            {
                                'value': 'https://www.4science.it/en/open-source/',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.startDate': [
                            {
                                'value': '2009-04',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.status': [
                            {
                                'value': 'ongoing',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-08-02T14:19:24.927+00:00',
                    'entityType': 'Project',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 26,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 87,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 88,
                    'name': 'frequency',
                    'value': 'M'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/26/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/26/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/26'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'uuid': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'name': 'DSpace-CRIS',
                    'handle': '123456789/34',
                    'metadata': {
                        'crispj.coinvestigators': [
                            {
                                'value': 'Mornati, Susanna',
                                'language': null,
                                'authority': '1325093a-1ef4-4d87-920d-02ce544fea00',
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
                        'crispj.coordinator': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'crispj.investigator': [
                            {
                                'value': 'Bollini, Andrea',
                                'language': null,
                                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'dc.date.accessioned': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'DSpace-CRIS is the first free open-source extension of DSpace for the Research Data and Information Management ever developed. Differently from other (commercial) CRIS/RIMS (star), DSpace-CRIS has the institutional repository as its core component, providing high visibility on the web to all the collected information and objects. DSpace-CRIS broadens DSpace functionality and expands its data model while remaining aligned with its code base. \n\nDSpace-CRIS adopts/is compliant with international standards and practices to facilitate interoperability and data transfer:\n\n- ORCID API v2 (complete compliance including pull/push of info for profiles, publications, projects). ORCID API v3 compliance is being released.\n\n- Signposting and ResourceSync (which implement COAR NGR Recommended Behaviors)\n\n- OpenAIRE Guidelines for Literature Repository Managers v4, for Data Archives, for CRIS Managers v1.1.1 (based on CERIF, released Nov. 2019)\n\n- PlanS (by Coalition S)\n\n- FAIR principles\n\nThe main characteristic of DSpace-CRIS is its flexible data model, which allows you to collect and manage research data and information typical of a CRIS system, to define entities and attributes with their reciprocal links. If you would just want to enhance the management of authors, provide name variants and IDs such as the ORCiD, exploit the varied ecosystem of persistent identifiers, link researchers to projects, awards, etc., DSpace-CRIS flexible data model can support this without aggravating the management burden of a normal institutional repository, while giving a great added value. Besides, it has useful features such as the collaboration network graph, aggregated (by researcher, by department) bibliometrics and statistics with graphic reporting, CVs and bibliographies, integration with ORCiD API v.3 and much more, you can explore them vie the menu items here on the left. \n\nIts flexibility allows to configure different data models and metadata schemas, providing the community with new and creative uses of DSpace, such as DSpace-GLAM (Galleries, Libraries, Archives and Museums) for the Cultural Heritage.',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-09-05T16:33:33Z (GMT). No. of bitstreams: 1\nlayers.png: 295537 bytes, checksum: 001e24b05d2c5d6cd76e88580f10cb9b (MD5)',
                                'language': 'en',
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/34',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.subject': [
                            {
                                'value': 'cerif',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            },
                            {
                                'value': 'datamanagement',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 1
                            },
                            {
                                'value': 'opensource',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 2
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'DSpace-CRIS',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.type': [
                            {
                                'value': 'applied research',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dspace.entity.type': [
                            {
                                'value': 'Project',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.acronym': [
                            {
                                'value': 'DSC',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate': [
                            {
                                'value': 'true',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate.url': [
                            {
                                'value': 'https://www.4science.it/en/open-source/',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.startDate': [
                            {
                                'value': '2009-04',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.status': [
                            {
                                'value': 'ongoing',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-08-02T14:19:24.927+00:00',
                    'entityType': 'Project',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 27,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 89,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 90,
                    'name': 'frequency',
                    'value': 'M'
                },
                {
                    'id': 91,
                    'name': 'frequency',
                    'value': 'W'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/27/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/27/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/27'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'uuid': '90f3b9ce-db65-479c-90d7-8c794abf942c',
                    'name': 'DSpace-CRIS',
                    'handle': '123456789/34',
                    'metadata': {
                        'crispj.coinvestigators': [
                            {
                                'value': 'Mornati, Susanna',
                                'language': null,
                                'authority': '1325093a-1ef4-4d87-920d-02ce544fea00',
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
                        'crispj.coordinator': [
                            {
                                'value': '4Science',
                                'language': null,
                                'authority': 'a14ba215-c0f0-4b74-b21a-06359bfabd45',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'crispj.investigator': [
                            {
                                'value': 'Bollini, Andrea',
                                'language': null,
                                'authority': '092b59e8-8159-4e70-98b5-93ec60bd3431',
                                'confidence': 600,
                                'place': 0
                            }
                        ],
                        'dc.date.accessioned': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-09-05T16:33:33Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'DSpace-CRIS is the first free open-source extension of DSpace for the Research Data and Information Management ever developed. Differently from other (commercial) CRIS/RIMS (star), DSpace-CRIS has the institutional repository as its core component, providing high visibility on the web to all the collected information and objects. DSpace-CRIS broadens DSpace functionality and expands its data model while remaining aligned with its code base. \n\nDSpace-CRIS adopts/is compliant with international standards and practices to facilitate interoperability and data transfer:\n\n- ORCID API v2 (complete compliance including pull/push of info for profiles, publications, projects). ORCID API v3 compliance is being released.\n\n- Signposting and ResourceSync (which implement COAR NGR Recommended Behaviors)\n\n- OpenAIRE Guidelines for Literature Repository Managers v4, for Data Archives, for CRIS Managers v1.1.1 (based on CERIF, released Nov. 2019)\n\n- PlanS (by Coalition S)\n\n- FAIR principles\n\nThe main characteristic of DSpace-CRIS is its flexible data model, which allows you to collect and manage research data and information typical of a CRIS system, to define entities and attributes with their reciprocal links. If you would just want to enhance the management of authors, provide name variants and IDs such as the ORCiD, exploit the varied ecosystem of persistent identifiers, link researchers to projects, awards, etc., DSpace-CRIS flexible data model can support this without aggravating the management burden of a normal institutional repository, while giving a great added value. Besides, it has useful features such as the collaboration network graph, aggregated (by researcher, by department) bibliometrics and statistics with graphic reporting, CVs and bibliographies, integration with ORCiD API v.3 and much more, you can explore them vie the menu items here on the left. \n\nIts flexibility allows to configure different data models and metadata schemas, providing the community with new and creative uses of DSpace, such as DSpace-GLAM (Galleries, Libraries, Archives and Museums) for the Cultural Heritage.',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-09-05T16:33:33Z (GMT). No. of bitstreams: 1\nlayers.png: 295537 bytes, checksum: 001e24b05d2c5d6cd76e88580f10cb9b (MD5)',
                                'language': 'en',
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/34',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.subject': [
                            {
                                'value': 'cerif',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            },
                            {
                                'value': 'datamanagement',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 1
                            },
                            {
                                'value': 'opensource',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 2
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'DSpace-CRIS',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.type': [
                            {
                                'value': 'applied research',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dspace.entity.type': [
                            {
                                'value': 'Project',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.acronym': [
                            {
                                'value': 'DSC',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate': [
                            {
                                'value': 'true',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.oamandate.url': [
                            {
                                'value': 'https://www.4science.it/en/open-source/',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.startDate': [
                            {
                                'value': '2009-04',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'oairecerif.project.status': [
                            {
                                'value': 'ongoing',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-08-02T14:19:24.927+00:00',
                    'entityType': 'Project',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/90f3b9ce-db65-479c-90d7-8c794abf942c'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 30,
            'subscriptionType': 'statistics',
            'subscriptionParameterList': [
                {
                    'id': 96,
                    'name': 'frequency',
                    'value': 'M'
                },
                {
                    'id': 97,
                    'name': 'frequency',
                    'value': 'D'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/30/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/30/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/30'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': 'b2140cd5-bfdf-4b5b-83fb-8bab4c899b40',
                    'uuid': 'b2140cd5-bfdf-4b5b-83fb-8bab4c899b40',
                    'name': 'DSpace administration issues: the community admin patch',
                    'handle': '123456789/107',
                    'metadata': {
                        'dc.contributor.author': [
                            {
                                'value': 'Donohue, Tim',
                                'language': null,
                                'authority': 'fcae3ff0-6a04-4385-8cae-04a38bbe4969',
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
                                'value': '2020-12-06T22:35:52Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-12-06T22:35:52Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.issued': [
                            {
                                'value': '2005',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'A large or medium repository, but also a small repository in some special cases, needs to allow a more decentralized management of administrative activities as: creation of new communities, creation of new collections, management of submitter and workflow groups, editing of published items, access policies and so on. Until now, DSpace allows only a partial decentralization of this functionalities thought into the role of COLLECTION ADMIN. After highlighting these needs, we will introduce the new role of COMMUNITY ADMIN and the changes made to the COLLECTION ADMIN role by our patch so to fix most of the previous needs. We will talk about the \'long history\' of this patch, made for the first time by Andrea against the 1.2 series and next kept updated, bug free and XMLUI aware by Tim from the 1.4 series. This \'pass the buck\', from Andrea to Tim and again together with some other people, shows how useful is for anyone to share results, experiences and customizations with the community so to get them back improved, reducing the cost of locale maintenance, debug and bug fix. We will close the presentation with the good news of the inclusion of this patch in the DSpace codebase for both XMLUI and JSPUI interfaces and also giving some notices about possible improvements in the next future. DSpace User Group Meeting 2009',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-12-06T22:35:52Z (GMT). No. of bitstreams: 0\n  Previous issue date: 2005',
                                'language': 'en',
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.other': [
                            {
                                'value': 'od______1149::b43204759808a65356e6cc3ba285d29f',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/107',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.language.iso': [
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.source': [
                            {
                                'value': 'Göteborgs universitets publikationer - e-publicering och e-arkiv',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.subject': [
                            {
                                'value': 'dspace',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            },
                            {
                                'value': 'open source',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 1
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'DSpace administration issues: the community admin patch',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.type': [
                            {
                                'value': 'Controlled Vocabulary for Resource Type Genres::text::conference object',
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
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-05-31T21:41:41.737+00:00',
                    'entityType': 'Publication',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 31,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 98,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 99,
                    'name': 'frequency',
                    'value': 'M'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/31/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/31/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/31'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': 'b2140cd5-bfdf-4b5b-83fb-8bab4c899b40',
                    'uuid': 'b2140cd5-bfdf-4b5b-83fb-8bab4c899b40',
                    'name': 'DSpace administration issues: the community admin patch',
                    'handle': '123456789/107',
                    'metadata': {
                        'dc.contributor.author': [
                            {
                                'value': 'Donohue, Tim',
                                'language': null,
                                'authority': 'fcae3ff0-6a04-4385-8cae-04a38bbe4969',
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
                                'value': '2020-12-06T22:35:52Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-12-06T22:35:52Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.issued': [
                            {
                                'value': '2005',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'A large or medium repository, but also a small repository in some special cases, needs to allow a more decentralized management of administrative activities as: creation of new communities, creation of new collections, management of submitter and workflow groups, editing of published items, access policies and so on. Until now, DSpace allows only a partial decentralization of this functionalities thought into the role of COLLECTION ADMIN. After highlighting these needs, we will introduce the new role of COMMUNITY ADMIN and the changes made to the COLLECTION ADMIN role by our patch so to fix most of the previous needs. We will talk about the \'long history\' of this patch, made for the first time by Andrea against the 1.2 series and next kept updated, bug free and XMLUI aware by Tim from the 1.4 series. This \'pass the buck\', from Andrea to Tim and again together with some other people, shows how useful is for anyone to share results, experiences and customizations with the community so to get them back improved, reducing the cost of locale maintenance, debug and bug fix. We will close the presentation with the good news of the inclusion of this patch in the DSpace codebase for both XMLUI and JSPUI interfaces and also giving some notices about possible improvements in the next future. DSpace User Group Meeting 2009',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-12-06T22:35:52Z (GMT). No. of bitstreams: 0\n  Previous issue date: 2005',
                                'language': 'en',
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.other': [
                            {
                                'value': 'od______1149::b43204759808a65356e6cc3ba285d29f',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/107',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.language.iso': [
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.source': [
                            {
                                'value': 'Göteborgs universitets publikationer - e-publicering och e-arkiv',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.subject': [
                            {
                                'value': 'dspace',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            },
                            {
                                'value': 'open source',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 1
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'DSpace administration issues: the community admin patch',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.type': [
                            {
                                'value': 'Controlled Vocabulary for Resource Type Genres::text::conference object',
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
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-05-31T21:41:41.737+00:00',
                    'entityType': 'Publication',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40'
                        }
                    }
                }
            },
            'type': 'subscription'
        },
        {
            'id': 32,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 100,
                    'name': 'frequency',
                    'value': 'W'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/32/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/32/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/32'
                }
            },
            '_embedded': {
                'ePerson': {
                    'id': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'uuid': '335647b6-8a52-4ecb-a8c1-7ebabb199bda',
                    'name': 'dspacedemo+admin@gmail.com',
                    'handle': null,
                    'metadata': {
                        'dspace.agreements.cookies': [
                            {
                                'value': '{\'authentication\':true,\'preferences\':true,\'acknowledgement\':true,\'google-analytics\':true}',
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
                    'lastActive': '2021-09-01T12:06:19.000+00:00',
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
                'dSpaceObject': {
                    'id': 'b2140cd5-bfdf-4b5b-83fb-8bab4c899b40',
                    'uuid': 'b2140cd5-bfdf-4b5b-83fb-8bab4c899b40',
                    'name': 'DSpace administration issues: the community admin patch',
                    'handle': '123456789/107',
                    'metadata': {
                        'dc.contributor.author': [
                            {
                                'value': 'Donohue, Tim',
                                'language': null,
                                'authority': 'fcae3ff0-6a04-4385-8cae-04a38bbe4969',
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
                                'value': '2020-12-06T22:35:52Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.available': [
                            {
                                'value': '2020-12-06T22:35:52Z',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.date.issued': [
                            {
                                'value': '2005',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.abstract': [
                            {
                                'value': 'A large or medium repository, but also a small repository in some special cases, needs to allow a more decentralized management of administrative activities as: creation of new communities, creation of new collections, management of submitter and workflow groups, editing of published items, access policies and so on. Until now, DSpace allows only a partial decentralization of this functionalities thought into the role of COLLECTION ADMIN. After highlighting these needs, we will introduce the new role of COMMUNITY ADMIN and the changes made to the COLLECTION ADMIN role by our patch so to fix most of the previous needs. We will talk about the \'long history\' of this patch, made for the first time by Andrea against the 1.2 series and next kept updated, bug free and XMLUI aware by Tim from the 1.4 series. This \'pass the buck\', from Andrea to Tim and again together with some other people, shows how useful is for anyone to share results, experiences and customizations with the community so to get them back improved, reducing the cost of locale maintenance, debug and bug fix. We will close the presentation with the good news of the inclusion of this patch in the DSpace codebase for both XMLUI and JSPUI interfaces and also giving some notices about possible improvements in the next future. DSpace User Group Meeting 2009',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.description.provenance': [
                            {
                                'value': 'Made available in DSpace on 2020-12-06T22:35:52Z (GMT). No. of bitstreams: 0\n  Previous issue date: 2005',
                                'language': 'en',
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.other': [
                            {
                                'value': 'od______1149::b43204759808a65356e6cc3ba285d29f',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.identifier.uri': [
                            {
                                'value': 'https://dspacecris7.4science.cloud/handle/123456789/107',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.language.iso': [
                            {
                                'value': 'en',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.source': [
                            {
                                'value': 'Göteborgs universitets publikationer - e-publicering och e-arkiv',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.subject': [
                            {
                                'value': 'dspace',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            },
                            {
                                'value': 'open source',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 1
                            }
                        ],
                        'dc.title': [
                            {
                                'value': 'DSpace administration issues: the community admin patch',
                                'language': null,
                                'authority': null,
                                'confidence': -1,
                                'place': 0
                            }
                        ],
                        'dc.type': [
                            {
                                'value': 'Controlled Vocabulary for Resource Type Genres::text::conference object',
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
                            }
                        ]
                    },
                    'inArchive': true,
                    'discoverable': true,
                    'withdrawn': false,
                    'lastModified': '2021-05-31T21:41:41.737+00:00',
                    'entityType': 'Publication',
                    'type': 'item',
                    '_links': {
                        'bundles': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/bundles'
                        },
                        'mappedCollections': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/mappedCollections'
                        },
                        'owningCollection': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/owningCollection'
                        },
                        'relationships': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/relationships'
                        },
                        'version': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/version'
                        },
                        'templateItemOf': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/templateItemOf'
                        },
                        'metrics': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/metrics'
                        },
                        'thumbnail': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40/thumbnail'
                        },
                        'self': {
                            'href': 'https://dspacecris7.4science.cloud/server/api/core/items/b2140cd5-bfdf-4b5b-83fb-8bab4c899b40'
                        }
                    }
                }
            },
            'type': 'subscription'
        }
    ]
};

export const findByEPersonAndDsoRes = {
    'type': {
        'value': 'paginated-list'
    },
    'pageInfo': {
        'elementsPerPage': 20,
        'totalElements': 2,
        'totalPages': 1,
        'currentPage': 1
    },
    '_links': {
        'self': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/search/findByEPersonAndDso?dspace_object_id=092b59e8-8159-4e70-98b5-93ec60bd3431&eperson_id=335647b6-8a52-4ecb-a8c1-7ebabb199bda'
        },
        'page': [
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/48'
            }
        ]
    },
    'page': [
        {
            'id': 22,
            'subscriptionType': 'content',
            'subscriptionParameterList': [
                {
                    'id': 161,
                    'name': 'frequency',
                    'value': 'M'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22'
                }
            },
            'type': 'subscription'
        },
        {
            'id': 48,
            'subscriptionType': 'statistics',
            'subscriptionParameterList': [
                {
                    'id': 159,
                    'name': 'frequency',
                    'value': 'D'
                },
                {
                    'id': 160,
                    'name': 'frequency',
                    'value': 'M'
                }
            ],
            '_links': {
                'dSpaceObject': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/48/dSpaceObject'
                },
                'ePerson': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/48/ePerson'
                },
                'self': {
                    'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/48'
                }
            },
            'type': 'subscription'
        }
    ]
};


export const findByEPersonAndDsoResEmpty = {
    'type': {
        'value': 'paginated-list'
    },
    'pageInfo': {
        'elementsPerPage': 0,
        'totalElements': 0,
        'totalPages': 1,
        'currentPage': 1
    },
    '_links': {
        'self': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/search/findByEPersonAndDso?dspace_object_id=092b59e8-8159-4e70-98b5-93ec60bd3431&eperson_id=335647b6-8a52-4ecb-a8c1-7ebabb199bda'
        },
        'page': [
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/22'
            },
            {
                'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/48'
            }
        ]
    },
    'page': []
};

export const subscription = {
    'id': 21,
    'type': 'subscription',
    'subscriptionParameterList': [
        {
            'id': 77,
            'name': 'frequency',
            'value': 'D'
        },
        {
            'id': 78,
            'name': 'frequency',
            'value': 'M'
        }
    ],
    'subscriptionType': 'content',
    '_links': {
        'dSpaceObject': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/21/dSpaceObject'
        },
        'ePerson': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/21/ePerson'
        },
        'self': {
            'href': 'https://dspacecris7.4science.cloud/server/api/core/subscriptions/21'
        }
    }
};


