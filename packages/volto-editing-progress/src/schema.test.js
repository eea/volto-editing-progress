import { JSONSchema } from './schema';

describe('JSONSchema', () => {
  it('builds schema using intl formatter and passes widget props', () => {
    const props = {
      id: 'field1',
      custom: true,
      intl: {
        formatMessage: ({ defaultMessage }) => defaultMessage,
      },
    };

    const schema = JSONSchema(props);

    expect(schema.required).toEqual(['json']);
    expect(schema.fieldsets[0].fields).toEqual(['json']);
    expect(schema.fieldsets[0].title).toBe('JSON code');
    expect(schema.properties.json.title).toBe('JSON code');
    expect(schema.properties.json.widget).toBe('jsonTextarea');
    expect(schema.properties.json.widgetProps).toEqual(props);
  });
});
