import { defineMessages } from 'react-intl';

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
  json: {
    id: 'JSON code',
    defaultMessage: 'JSON code',
  },
});
