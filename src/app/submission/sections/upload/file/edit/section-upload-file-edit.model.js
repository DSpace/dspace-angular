export var BITSTREAM_METADATA_FORM_GROUP_CONFIG = {
    id: 'metadata',
    group: []
};
export var BITSTREAM_METADATA_FORM_GROUP_LAYOUT = {
    element: {
        container: 'form-group',
        label: 'col-form-label'
    },
    grid: {
        label: 'col-sm-3'
    }
};
export var BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG = {
    id: 'accessConditions',
    groupFactory: null,
};
export var BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_LAYOUT = {
    grid: {
        group: 'form-row'
    }
};
export var BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG = {
    id: 'name',
    label: 'submission.sections.upload.form.access-condition-label',
    options: []
};
export var BITSTREAM_FORM_ACCESS_CONDITION_TYPE_LAYOUT = {
    element: {
        container: 'p-0',
        label: 'col-form-label'
    },
    grid: {
        host: 'col-md-10'
    }
};
export var BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG = {
    id: 'startDate',
    label: 'submission.sections.upload.form.from-label',
    placeholder: 'submission.sections.upload.form.from-placeholder',
    inline: false,
    toggleIcon: 'far fa-calendar-alt',
    relation: [
        {
            action: 'ENABLE',
            connective: 'OR',
            when: []
        }
    ],
    required: true,
    validators: {
        required: null
    },
    errorMessages: {
        required: 'submission.sections.upload.form.date-required'
    }
};
export var BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_LAYOUT = {
    element: {
        container: 'p-0',
        label: 'col-form-label'
    },
    grid: {
        host: 'col-md-4'
    }
};
export var BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG = {
    id: 'endDate',
    label: 'submission.sections.upload.form.until-label',
    placeholder: 'submission.sections.upload.form.until-placeholder',
    inline: false,
    toggleIcon: 'far fa-calendar-alt',
    relation: [
        {
            action: 'ENABLE',
            connective: 'OR',
            when: []
        }
    ],
    required: true,
    validators: {
        required: null
    },
    errorMessages: {
        required: 'submission.sections.upload.form.date-required'
    }
};
export var BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_LAYOUT = {
    element: {
        container: 'p-0',
        label: 'col-form-label'
    },
    grid: {
        host: 'col-md-4'
    }
};
export var BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG = {
    id: 'groupUUID',
    label: 'submission.sections.upload.form.group-label',
    options: [],
    relation: [
        {
            action: 'ENABLE',
            connective: 'OR',
            when: []
        }
    ],
    required: true,
    validators: {
        required: null
    },
    errorMessages: {
        required: 'submission.sections.upload.form.group-required'
    }
};
export var BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_LAYOUT = {
    element: {
        container: 'p-0',
        label: 'col-form-label'
    },
    grid: {
        host: 'col-sm-10'
    }
};
//# sourceMappingURL=section-upload-file-edit.model.js.map