import { defineMessages } from 'react-intl';
import TextareaJSONWidget from './TextareaJSONWidget';
export const schemaModal = (props) => {
  return {
    title: props.intl.formatMessage(messages.fieldConditions),
    required: [],
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'condition',
          'hideReady',
          'iconEmpty',
          'iconReady',
          'labelEmpty',
          'labelReady',
          'link',
          'linkLabel',
          'prefix',
          'states',
        ],
      },
    ],
    properties: {
      condition: {
        title: props.intl.formatMessage(messages.condition),
        widget: 'customText',
        widgetProps: {
          value: 'python:value',
        },
      },
      hideReady: {
        title: props.intl.formatMessage(messages.hideReady),
        widget: 'customText',
        widgetProps: {
          value: 'False',
        },
      },
      iconEmpty: {
        title: props.intl.formatMessage(messages.iconEmpty),
        widget: 'customText',
        widgetProps: {
          value: 'eea-icon eea-icon-edit',
        },
      },
      iconReady: {
        title: props.intl.formatMessage(messages.iconReady),
        widget: 'customText',
        widgetProps: {
          value: 'eea-icon eea-icon-check',
        },
      },
      labelEmpty: {
        title: props.intl.formatMessage(messages.labelEmpty),
        widget: 'customText',
        widgetProps: {
          value: 'Please set the {label} of this {context.portal_type}',
        },
      },
      labelReady: {
        title: props.intl.formatMessage(messages.labelReady),
        widget: 'customText',
        widgetProps: {
          value: 'You added the {label}',
        },
      },
      link: {
        title: props.intl.formatMessage(messages.link),
        widget: 'customText',
        widgetProps: {
          value:
            'edit#fieldset-supporting information-field-label-data_description',
        },
      },
      linkLabel: {
        title: props.intl.formatMessage(messages.linkLabel),
        widget: 'customText',
        widgetProps: {
          value: 'Add {label}',
        },
      },
      prefix: {
        title: props.intl.formatMessage(messages.prefix),
        widget: 'text',
      },
      states: {
        title: props.intl.formatMessage(messages.states),
        widget: 'text',
      },
    },
  };
};
export const addSchemaModal = (props) => {
  return {
    required: ['contentType'],
    fieldsets: [
      {
        id: 'default',
        title: props.intl.formatMessage(messages.contentType),
        fields: ['contentType'],
      },
      {
        id: 'state',
        title: props.intl.formatMessage(messages.state),
        fields: ['state'],
      },
    ],
    properties: {
      state: {
        title: props.intl.formatMessage(messages.state),
        schema: schemaModal(props),
        widget: 'object_list',
      },
      contentType: {
        title: props.intl.formatMessage(messages.contentType),
        widget: 'text',
      },
    },
  };
};
export const JSONSchema = (props) => {
  return {
    required: ['json'],
    fieldsets: [
      {
        id: 'default',
        title: props.intl.formatMessage(messages.json),
        fields: ['json'],
      },
    ],
    properties: {
      json: {
        title: props.intl.formatMessage(messages.json),
        widget: 'jsonTextarea',
        widgetProps: { ...props },
      },
    },
  };
};
const messages = defineMessages({
  condition: {
    id: 'Condition',
    defaultMessage: 'Condition',
  },
  hideReady: {
    id: 'Hide Ready',
    defaultMessage: 'Hide Ready',
  },
  iconEmpty: {
    id: 'Icon Empty',
    defaultMessage: 'Icon Empty',
  },
  iconReady: {
    id: 'Icon Ready',
    defaultMessage: 'Icon Ready',
  },
  labelEmpty: {
    id: 'Label Empty',
    defaultMessage: 'Label Empty',
  },
  labelReady: {
    id: 'Label Ready',
    defaultMessage: 'Label Ready',
  },
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
  linkLabel: {
    id: 'Link Label',
    defaultMessage: 'Link Label',
  },
  prefix: {
    id: 'Prefix',
    defaultMessage: 'Prefix',
  },
  states: {
    id: 'States (to add more use , (comma) without adding spaces)',
    defaultMessage: 'States (to add more use , (comma) without adding spaces)',
  },
  state: {
    id: 'Field',
    defaultMessage: 'Field',
  },
  contentType: {
    id: 'Content Type',
    defaultMessage: 'Content Type',
  },
  json: {
    id: 'JSON code',
    defaultMessage: 'JSON code',
  },
  fieldConditions: {
    id: 'field conditions',
    defaultMessage: 'field conditions',
  },
});
