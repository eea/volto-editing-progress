import { defineMessages } from 'react-intl';
export const schemaModal = ({ intl }) => {
  return {
    title: intl.formatMessage(messages.fieldConditions),
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
        title: intl.formatMessage(messages.condition),
        widget: 'text',
      },
      hideReady: {
        title: intl.formatMessage(messages.hideReady),
        widget: 'text',
      },
      iconEmpty: {
        title: intl.formatMessage(messages.iconEmpty),
        widget: 'text',
      },
      iconReady: {
        title: intl.formatMessage(messages.iconReady),
        widget: 'text',
      },
      labelEmpty: {
        title: intl.formatMessage(messages.labelEmpty),
        widget: 'text',
      },
      labelReady: {
        title: intl.formatMessage(messages.labelReady),
        widget: 'text',
      },
      link: {
        title: intl.formatMessage(messages.link),
        widget: 'text',
      },
      linkLabel: {
        title: intl.formatMessage(messages.linkLabel),
        widget: 'text',
      },
      prefix: {
        title: intl.formatMessage(messages.prefix),
        widget: 'text',
      },
      states: {
        title: intl.formatMessage(messages.states),
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
        widget: 'textarea',
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
