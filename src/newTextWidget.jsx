/**
 * TextWidget component.
 * @module components/manage/Widgets/TextWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

import { injectIntl } from 'react-intl';
import { Icon, FormFieldWrapper } from '@plone/volto/components';

/**
 * The simple text widget.
 *
 * It is the default fallback widget, so if no other widget is found based on
 * passed field properties, it will be used.
 */
class CustomTextWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
    focus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    icon: PropTypes.shape({
      xmlns: PropTypes.string,
      viewBox: PropTypes.string,
      content: PropTypes.string,
    }),
    iconAction: PropTypes.func,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    wrapped: PropTypes.bool,
    placeholder: PropTypes.string,
    widgetProps: PropTypes.shape({
      placeholder: PropTypes.string,
      value: PropTypes.string,
    }),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    error: [],
    value: null,
    onChange: () => {},
    onBlur: () => {},
    onClick: () => {},
    onEdit: null,
    onDelete: null,
    focus: false,
    icon: null,
    iconAction: null,
    minLength: null,
    maxLength: null,
    widgetProps: {
      value: null,
      placeholder: null,
    },
  };

  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  state = {};
  componentDidMount() {
    if (this.props.focus) {
      this.node.focus();
    }
  }
  //Component did mount doesn't work, only the last input gets updated
  //Using getDerivedStateFromProps all inputs get updated until all of them are populated
  static getDerivedStateFromProps(props, state) {
    if (props.value == null)
      props.onChange(
        props.id,
        props.value != null
          ? props.value
          : props.widgetProps.value != null
          ? props.widgetProps.value
          : '',
      );

    // Return null to indicate no change to state.
    return null;
  }
  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      id,
      onChange,
      onBlur,
      onClick,
      icon,
      iconAction,
      minLength,
      maxLength,
      isDisabled,
      value,
      placeholder,
    } = this.props;
    return (
      <FormFieldWrapper {...this.props} className="text">
        <Input
          id={`field-${id}`}
          name={id}
          value={value || ''}
          disabled={isDisabled}
          icon={icon || null}
          placeholder={placeholder || ''}
          onChange={({ target }) =>
            onChange(id, target.value === '' ? undefined : target.value)
          }
          ref={(node) => {
            this.node = node;
          }}
          onBlur={({ target }) =>
            onBlur(id, target.value === '' ? undefined : target.value)
          }
          onClick={() => onClick()}
          minLength={minLength || null}
          maxLength={maxLength || null}
        />
        {icon && iconAction && (
          <button className={`field-${id}-action-button`} onClick={iconAction}>
            <Icon name={icon} size="18px" />
          </button>
        )}
      </FormFieldWrapper>
    );
  }
}

export default injectIntl(CustomTextWidget);