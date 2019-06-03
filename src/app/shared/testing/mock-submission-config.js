export var MOCK_SUBMISSION_CONFIG = {
    submission: {
        autosave: {
            // NOTE: which metadata trigger an autosave
            metadata: ['dc.title', 'dc.identifier.doi', 'dc.identifier.pmid', 'dc.identifier.arxiv'],
            // NOTE: every how many minutes submission is saved automatically
            timer: 5
        },
        icons: {
            metadata: [
                {
                    name: 'mainField',
                    style: 'fas fa-user'
                },
                {
                    name: 'relatedField',
                    style: 'fas fa-university'
                },
                {
                    name: 'otherRelatedField',
                    style: 'fas fa-circle'
                },
                {
                    name: 'default',
                    style: ''
                }
            ],
            authority: {
                confidence: [
                    {
                        value: 600,
                        style: 'text-success'
                    },
                    {
                        value: 500,
                        style: 'text-info'
                    },
                    {
                        value: 400,
                        style: 'text-warning'
                    },
                    {
                        value: 'default',
                        style: 'text-muted'
                    },
                ]
            }
        }
    }
};
//# sourceMappingURL=mock-submission-config.js.map