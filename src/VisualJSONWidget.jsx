import React, { useState, useEffect } from 'react';
import { ModalForm } from '@plone/volto/components';
import { JSONSchema } from './schema';
import {
  Button,
  Container,
  Segment,
  Divider,
  Sidebar,
  List,
  Dropdown,
} from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import './less/editor.less';
import _ from 'lodash';
import { FormattedMessage, defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { getRawContent } from './actions';
const messages = defineMessages({
  jsonTitle: {
    id: 'Edit JSON',
    defaultMessage: 'Edit JSON',
  },
});
const STATES_NAME = ['Private', 'Pending', 'Published'].map((state) => ({
  key: state,
  text: state,
  value: state,
}));
const SIDEBAR_WIDTH = '250px';
const COMPONENT_HEIGHT = '750px';
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
    if (currentContentTypeData[localRuleIndex].prefix === currentField) {
      if (statesToAdd !== undefined)
        currentContentTypeData[localRuleIndex].states = statesToAdd;
      else currentContentTypeData.splice(localRuleIndex, 1);
    }
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
const SidebarComponent = (props) => {
  const { types, currentContentType, handleChangeSelectedContentType } = props;
  const [filtredTypes, setFiltredTypes] = useState({ ...types });
  const [inputValue, setInputValue] = useState('');
  useEffect(() => {
    setFiltredTypes({ ...types });
  }, [types]);
  const handleInputChange = (e) => {
    if (e.target.value == null) return;
    setInputValue(e.target.value);
    if (
      types.loaded &&
      !types.loading &&
      Array.isArray(types.types) &&
      types.types.length > 0
    ) {
      setFiltredTypes({
        ...types,
        types: types.types.filter((type) =>
          type.title.toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      });
    }
  };
  const backgroundColor = (currentContentType, modified) => {
    let color = undefined;
    if (modified) {
      color = 'lightgray';
    }
    if (currentContentType) {
      color = 'lightblue';
    }
    return color;
  };
  return (
    <Sidebar
      as={List}
      animation="push"
      icon="labeled"
      visible
      relaxed
      size="big"
      divided
      selection
      style={{ width: SIDEBAR_WIDTH }}
    >
      <input
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search... "
        style={{ paddingLeft: ' 10px' }}
      />
      {filtredTypes.loaded &&
        !filtredTypes.loading &&
        Array.isArray(filtredTypes.types) &&
        filtredTypes.types.map((type) => (
          <List.Item
            style={{
              padding: '25px 5px',
              textAlign: 'center',
              backgroundColor: backgroundColor(
                currentContentType?.id === type.id,
                Object.keys(props.value).includes(type.id),
              ),
            }}
            key={type.id}
            onClick={(e) => handleChangeSelectedContentType(e, type)}
          >
            <List.Content>
              <List.Header>{type.title}</List.Header>
            </List.Content>
          </List.Item>
        ))}
    </Sidebar>
  );
};
const EditDataComponent = ({
  request,
  handleOnDropdownChange,
  currentContentType,
  value,
}) => {
  //Returns the saved values for dropdown with the first letter in uppercase
  const getDropdownValues = (currentField) => {
    if (
      !request.loading &&
      request.loaded &&
      currentContentType &&
      value[currentContentType.id]
    )
      return value[currentContentType.id]
        .find((rule) => rule.prefix === currentField)
        ?.states.map((state) => state.charAt(0).toUpperCase() + state.slice(1));

    return undefined;
  };
  return (
    <Segment
      style={{
        width: '100%',
        paddingBottom:
          request?.data?.fieldsets[0]?.fields.length > 9 ? '120px' : '',
        maxHeight: COMPONENT_HEIGHT,
        overflow: request?.data?.fieldsets[0]?.fields.length > 9 ? 'auto' : '',
      }}
    >
      <List
        divided
        relaxed
        verticalAlign="middle"
        style={{ width: '100%', height: '100%' }}
      >
        {request?.loaded &&
          !request?.loading &&
          request?.data?.fieldsets[0]?.fields?.map((currentField) => (
            <List.Item key={currentField}>
              <List.Content
                floated="right"
                verticalAlign="middle"
                style={{ paddingTop: '10px' }}
              >
                {request?.loaded && !request?.loading && (
                  <Dropdown
                    placeholder="Fields"
                    multiple
                    floating
                    selection
                    search
                    defaultValue={getDropdownValues(currentField)}
                    options={STATES_NAME}
                    onChange={(e, data) =>
                      handleOnDropdownChange(e, data, currentField)
                    }
                  />
                )}
              </List.Content>
              <List.Content
                style={{ fontSize: '1.75rem', padding: '15px' }}
                verticalAlign="middle"
              >
                {currentField}
              </List.Content>
            </List.Item>
          ))}
      </List>
    </Segment>
  );
};
const VisualJSONWidget = (props) => {
  const { id, value = {}, onChange } = props;
  const [isJSONEditorOpen, setIsJSONEditorOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(
    props.intl.formatMessage(messages.jsonTitle),
  );
  const [currentContentType, setCurrentContentType] = useState();

  const handleOnCancel = (e) => {
    setIsJSONEditorOpen(false);
  };
  const handleEditJSON = (e) => {
    e.preventDefault();
    setModalTitle(props.intl.formatMessage(messages.jsonTitle));
    setIsJSONEditorOpen(true);
  };
  const onJSONSubmit = (e) => {
    setIsJSONEditorOpen(false);
    if (typeof e.json === 'string') {
      if (isValidJson(e.json)) {
        onChange(id, JSON.parse(e.json));
      }
    } else {
      onChange(id, e.json);
    }
  };
  const types = useSelector((state) => state.types);

  useEffect(() => {
    if (types.loaded && !types.loading && Array.isArray(types.types)) {
      setCurrentContentType(types.types[0]);
    }
  }, [types]);

  const handleChangeSelectedContentType = (e, type) => {
    setCurrentContentType(type);
  };
  const path = flattenToAppURL(
    currentContentType?.['@id'] ? `${currentContentType['@id']}` : null,
  );

  const dispatch = useDispatch();
  const request = useSelector((state) => state.rawdata?.[path]);

  const content = request?.data;
  React.useEffect(() => {
    if (path && !request?.loading && !request?.loaded && !content)
      dispatch(getRawContent(path));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, path, content, request?.loaded, request?.loading]);

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
        {isJSONEditorOpen && (
          <ModalForm
            schema={JSONSchema(props)}
            onSubmit={onJSONSubmit}
            title={modalTitle}
            open={isJSONEditorOpen}
            formData={{ json: JSON.stringify(value, undefined, 2) }}
            onCancel={handleOnCancel}
            key="JSON"
          />
        )}
        <Container>
          <Button onClick={handleEditJSON} color="grey">
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
};
export default VisualJSONWidget;
