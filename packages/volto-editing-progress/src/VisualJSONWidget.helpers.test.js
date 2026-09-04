import {
  addNewStateToAlreadyExistingField,
  createFieldRule,
  doesPrefixExistInCurrentContentTypeData,
  isValidJson,
} from './VisualJSONWidget';

describe('VisualJSONWidget helper functions', () => {
  it('validates json strings', () => {
    expect(isValidJson('{"a":1}')).toBe(true);
    expect(isValidJson('{"a":')).toBe(false);
  });

  it('checks if a prefix exists in content type rules', () => {
    const rules = [{ prefix: 'title' }, { prefix: 'description' }];

    expect(doesPrefixExistInCurrentContentTypeData(rules, 'summary')).toBe(
      true,
    );
    expect(doesPrefixExistInCurrentContentTypeData(rules, 'title')).toBe(false);
  });

  it('creates a new field rule with defaults', () => {
    expect(createFieldRule('summary', ['all'])).toEqual({
      prefix: 'summary',
      states: ['all'],
      condition: 'python:value',
      link: 'edit#fieldset-metadata-field-label-summary',
      linkLabel: 'Add {label}',
    });
  });

  it('updates existing matching field with state and metadata', () => {
    const rules = [
      {
        prefix: 'summary',
        states: ['private'],
        condition: 'python:value',
        link: 'edit#old',
        linkLabel: 'Old label',
      },
    ];

    addNewStateToAlreadyExistingField(
      rules,
      'summary',
      ['published'],
      'New label',
      'python:True',
      'edit#new',
    );

    expect(rules[0]).toEqual({
      prefix: 'summary',
      states: ['published'],
      condition: 'python:True',
      link: 'edit#new',
      linkLabel: 'New label',
    });
  });

  it('removes existing matching rule when states are undefined and no message', () => {
    const rules = [
      { prefix: 'title', states: ['all'] },
      { prefix: 'summary', states: ['all'] },
    ];

    addNewStateToAlreadyExistingField(
      rules,
      'summary',
      undefined,
      undefined,
      undefined,
      undefined,
    );

    expect(rules).toEqual([{ prefix: 'title', states: ['all'] }]);
  });
});
