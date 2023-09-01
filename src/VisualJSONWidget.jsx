import React, { useState, useEffect } from 'react';
import { ModalForm } from '@plone/volto/components';
import { JSONSchema } from './schema';
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
) {
  for (
    let localRuleIndex = 0;
    localRuleIndex < currentContentTypeData.length;
    localRuleIndex++
  ) {
    if (currentContentTypeData[localRuleIndex].prefix !== currentField)
      continue;
    if (statesToAdd !== undefined)
      currentContentTypeData[localRuleIndex].states = statesToAdd;
    else currentContentTypeData.splice(localRuleIndex, 1);
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
    hideReady: 'False',
    iconEmpty: 'eea-icon eea-icon-edit',
    iconReady: 'eea-icon eea-icon-check',
    labelEmpty: 'Please set the {label} of this {context.portal_type}',
    labelReady: 'You added the {label}',
    link: 'edit#fieldset-supporting information-field-label-data_description',
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

  const handleOnDropdownChange = (e, data, currentField) => {
    const states = data.value.length > 0 ? data.value : undefined;
    const statesToAdd = states?.map((state) => state.toLowerCase());
    const localCopyOfValue = _.cloneDeep(value);
    const currentContentTypeData = localCopyOfValue[currentContentType.id];

    if (!currentContentTypeData) {
      //Reference doesn't work with currentContentTypeData
      localCopyOfValue[currentContentType.id] = [
        createFieldRule(currentField, statesToAdd),
      ];
    } else if (
      doesPrefixExistInCurrentContentTypeData(
        currentContentTypeData,
        currentField,
      )
    ) {
      currentContentTypeData.push(createFieldRule(currentField, statesToAdd));
    } else {
      addNewStateToAlreadyExistingField(
        currentContentTypeData,
        currentField,
        statesToAdd,
      );
    }
    //The variable currentContentTypeData cannot be used here because of eslint and delete keyword
    if (localCopyOfValue[currentContentType.id]?.length === 0) {
      delete localCopyOfValue[currentContentType.id];
    }

    onChange(id, localCopyOfValue);
  };

  return (
    <>
      <div>
        {/* {isJSONEditorOpen && ( */}
        <ModalForm
          schema={JSONSchema(props)}
          onSubmit={onJSONSubmit}
          title={props.intl.formatMessage(messages.jsonTitle)}
          open={isJSONEditorOpen}
          formData={{ json: JSON.stringify(value, undefined, 2) }}
          onCancel={handleOnCancel}
          key="JSON"
        />
        {/* )} */}
        <Container>
          <Button onClick={handleEditJSON} color="grey" id="json_button">
            <FormattedMessage id="Edit JSON" defaultMessage="Edit JSON" />
          </Button>
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
