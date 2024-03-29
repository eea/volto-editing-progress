import React, { useState, useEffect } from 'react';
import { ModalForm } from '@plone/volto/components';
import { JSONSchema } from './schema';
import { Dropdown } from 'semantic-ui-react';

import {
  Button,
  Container,
  Segment,
  Divider,
  Sidebar,
} from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import './less/editor.less';
import _ from 'lodash';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getRawContent } from './actions';
import SidebarComponent from './WidgetSidebar';
import EditDataComponent from './WidgetDataComponent';
import './less/editor.less';
const messages = defineMessages({
  jsonTitle: {
    id: 'Edit JSON',
    defaultMessage: 'Edit JSON',
  },
});

export const SIDEBAR_WIDTH = '250px';
export const COMPONENT_HEIGHT = '750px';

function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

function addNewStateToAlreadyExistingField(
  currentContentTypeData,
  currentField,
  statesToAdd,
  message,
  condition,
  link,
) {
  for (
    let localRuleIndex = 0;
    localRuleIndex < currentContentTypeData.length;
    localRuleIndex++
  ) {
    if (currentContentTypeData[localRuleIndex].prefix !== currentField)
      continue;

    // TODO rewrite message as an object with multiple message as a key and add it
    // to currentContentTypeData dinamically in order to create the posibillity
    // for multiple fields

    if (message) currentContentTypeData[localRuleIndex].linkLabel = message;
    if (condition) currentContentTypeData[localRuleIndex].condition = condition;
    if (link) currentContentTypeData[localRuleIndex].link = link;
    if (statesToAdd !== undefined) {
      currentContentTypeData[localRuleIndex].states = statesToAdd;
    } else if (!message) currentContentTypeData.splice(localRuleIndex, 1);
  }
}

function doesPrefixExistInCurrentContentTypeData(
  currentContentTypeData,
  currentField,
) {
  return currentContentTypeData.every((rule) => rule.prefix !== currentField);
}

function createFieldRule(currentField, statesToAdd) {
  return {
    prefix: currentField,
    states: statesToAdd,
    condition: 'python:value',
    link: 'edit#fieldset-metadata-field-label-' + currentField,
    linkLabel: 'Add {label}',
  };
}

const VisualJSONWidget = (props) => {
  const { id, value = {}, onChange } = props;
  const [isJSONEditorOpen, setIsJSONEditorOpen] = useState(false);
  const [currentContentType, setCurrentContentType] = useState();

  const path = flattenToAppURL(
    currentContentType?.['@id'] ? `${currentContentType['@id']}` : null,
  );

  const dispatch = useDispatch();
  const request = useSelector((state) => state.rawdata?.[path]);
  const content = request?.data;
  const types = useSelector((state) => state.types);
  const fields =
    request?.data?.fieldsets.reduce((acc, cur) => {
      return [...acc, ...(cur.fields || [])];
    }, []) || [];
  useEffect(() => {
    if (path && !request?.loading && !request?.loaded && !content)
      dispatch(getRawContent(path));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, path, content, request?.loaded, request?.loading]);

  useEffect(() => {
    if (types.loaded && !types.loading && Array.isArray(types.types)) {
      setCurrentContentType(types.types[0]);
    }
  }, [types]);

  const handleOnCancel = (e) => {
    setIsJSONEditorOpen(false);
  };

  const handleEditJSON = (e) => {
    e.preventDefault();
    setIsJSONEditorOpen(true);
  };
  const makeFirstLetterCapital = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const onJSONSubmit = (e) => {
    setIsJSONEditorOpen(false);
    if (typeof e.json === 'string' && isValidJson(e.json)) {
      onChange(id, JSON.parse(e.json));
      return;
    }
    onChange(id, e.json);
  };

  const handleChangeSelectedContentType = (e, type) => {
    setCurrentContentType(type);
  };

  const handleOnDropdownChange = (
    e,
    data,
    currentField,
    message,
    condition,
    link,
  ) => {
    const states = data.value;
    const statesToAdd = states?.map((state) => state.toLowerCase());
    const localCopyOfValue = _.cloneDeep(value);
    const currentContentTypeData = localCopyOfValue[currentContentType.id];

    if (!currentContentTypeData && data) {
      //Reference doesn't work with currentContentTypeData
      localCopyOfValue[currentContentType.id] = [
        createFieldRule(currentField, statesToAdd),
      ];
    } else if (
      doesPrefixExistInCurrentContentTypeData(
        currentContentTypeData,
        currentField,
      ) &&
      data
    ) {
      currentContentTypeData.push(createFieldRule(currentField, statesToAdd));
    } else {
      addNewStateToAlreadyExistingField(
        currentContentTypeData,
        currentField,
        statesToAdd,
        message,
        condition,
        link,
      );
    }
    //The variable currentContentTypeData cannot be used here because of eslint and delete keyword
    if (localCopyOfValue[currentContentType.id]?.length === 0) {
      delete localCopyOfValue[currentContentType.id];
    }
    onChange(id, localCopyOfValue);
  };
  const getDropdownValues = (currentField) => {
    if (
      !request.loading &&
      request.loaded &&
      currentContentType &&
      value[currentContentType.id]
    )
      return value[currentContentType.id]
        .find((rule) => rule?.prefix === currentField)
        ?.states.map((state) => makeFirstLetterCapital(state));

    return undefined;
  };

  return (
    <>
      <div>
        {isJSONEditorOpen && (
          <ModalForm
            schema={JSONSchema(props)}
            onSubmit={onJSONSubmit}
            title={props.intl.formatMessage(messages.jsonTitle)}
            open={isJSONEditorOpen}
            formData={{ json: JSON.stringify(value, undefined, 2) }}
            onCancel={handleOnCancel}
            key="JSON"
          />
        )}
        <Container>
          <Button onClick={handleEditJSON} color="grey" id="json_button">
            <FormattedMessage id="Edit JSON" defaultMessage="Edit JSON" />
          </Button>

          {fields && (
            <Dropdown
              className="ui grey button dropdown-button"
              text="Add Property"
              options={fields
                .filter((field) => {
                  return (
                    getDropdownValues(field) === undefined &&
                    !request.data.required.includes(field)
                  );
                })
                .map((field) => {
                  return { key: field, text: field, value: field };
                })}
              onChange={(e, t) => {
                handleOnDropdownChange(e, { value: ['all'] }, t.value);
              }}
            />
          )}
        </Container>
        <Divider />
      </div>
      <Sidebar.Pushable as={Segment} style={{ height: COMPONENT_HEIGHT }}>
        <SidebarComponent
          handleChangeSelectedContentType={handleChangeSelectedContentType}
          currentContentType={currentContentType}
          types={types}
          value={value}
        />
        <Sidebar.Pusher style={{ width: `calc(100% - ${SIDEBAR_WIDTH})` }}>
          <EditDataComponent
            request={request}
            handleOnDropdownChange={handleOnDropdownChange}
            currentContentType={currentContentType}
            value={value}
            fields={fields}
            getDropdownValues={getDropdownValues}
          />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </>
  );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
VisualJSONWidget.propTypes = {
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
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
VisualJSONWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: null,
  onChange: null,
  onEdit: null,
  onDelete: null,
  title: '',
  id: '',
};
export default injectIntl(VisualJSONWidget);
