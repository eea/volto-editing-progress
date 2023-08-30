/**
 * TextAreaJSONWidget component.
 * @module components/manage/Widgets/TextAreaJSONWidget
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextArea } from 'semantic-ui-react';

import { defineMessages, injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

const messages = defineMessages({
  invalidJSONError: {
    id: 'Please enter valid JSON!',
    defaultMessage: 'Please enter valid JSON!',
  },
});

function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

const TextAreaJSONWidget = (props) => {
  const { id, onChange, placeholder, isDisabled, intl } = props;
  const value =
    typeof props.value === 'string' ? JSON.parse(props.value) : props.value;
  const [invalidJSONError, setInvalidJSONError] = useState([]);
  const [prevValue, setPrevValue] = useState(value);

  /**
   * will update Textarea to current value only if JSON is valid
   * otherwise it will keep the previous value to avoid invalid JSON errors
   * value is stringified, prevValue is object
   * @param {string} id
   * @param {string} value
   */
  const onhandleChange = (id, value) => {
    if (!isValidJson(value)) {
      setInvalidJSONError([intl.formatMessage(messages.invalidJSONError)]);
      // remove error message after 1.5 seconds, since serves an informative role:
      // in case of invalidation attempt the last valid JSON is shown
      setTimeout(() => setInvalidJSONError([]), 1500);
      onChange(id, prevValue);
    } else {
      setPrevValue(JSON.parse(value));
      setInvalidJSONError([]);
      onChange(id, JSON.parse(value));
    }
  };

  return (
    <FormFieldWrapper {...props} className="textarea" error={invalidJSONError}>
      <TextArea
        id={`field-${id}`}
        name={id}
        value={prevValue ? JSON.stringify(prevValue, undefined, 2) : ''}
        disabled={isDisabled}
        placeholder={placeholder}
        rows="10"
        style={{ height: '400px', maxWidth: 'none' }}
        onChange={({ target }) =>
          onhandleChange(id, target.value === '' ? undefined : target.value)
        }
      />
    </FormFieldWrapper>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
TextAreaJSONWidget.propTypes = {
  widgetProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.object,
    onChange: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    wrapped: PropTypes.bool,
    placeholder: PropTypes.string,
  }),
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
TextAreaJSONWidget.defaultProps = {
  widgetProps: {
    description: null,
    required: false,
    error: [],
    value: null,
    onChange: null,
    onEdit: null,
    onDelete: null,
  },
};

export default injectIntl(TextAreaJSONWidget);
