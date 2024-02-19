import React, { useEffect, useState } from 'react';
import { Segment, Dropdown, Accordion, Icon } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useSelector, useDispatch } from 'react-redux';
import { getRawContent } from './actions';
import { COMPONENT_HEIGHT } from './VisualJSONWidget';

import './less/editor.less';

export function makeFirstLetterCapital(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const EditDataComponent = ({
  request,
  handleOnDropdownChange,
  currentContentType,
  value,
  fields,
  getDropdownValues,
}) => {
  const path = flattenToAppURL(
    '/@vocabularies/plone.app.vocabularies.WorkflowStates',
  );

  const dispatch = useDispatch();
  const requestStateOptions = useSelector((state) => state.rawdata?.[path]);
  const content = requestStateOptions?.data;

  useEffect(() => {
    if (
      path &&
      !requestStateOptions?.loading &&
      !requestStateOptions?.loaded &&
      !content
    )
      dispatch(getRawContent(path));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    path,
    content,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    requestStateOptions?.loaded,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    requestStateOptions?.loading,
  ]);

  //Returns the saved values for dropdown with the first letter in uppercase

  const getValues = (currentField) => {
    if (
      !request.loading &&
      request.loaded &&
      currentContentType &&
      value[currentContentType.id]
    )
      return value[currentContentType.id].find(
        (rule) => rule?.prefix === currentField,
      );

    return undefined;
  };

  const renderLabel = (label) => ({
    color: 'blue',
    content: `${label.text}`,
  });

  const createStateOption = (stateOptions) => {
    return ['all', ...(stateOptions || [])].map((state) => ({
      key: makeFirstLetterCapital(state),
      text: makeFirstLetterCapital(state),
      value: makeFirstLetterCapital(state),
    }));
  };
  const [activeIndex, setActiveIndex] = useState(0);
  // const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');
  const [conditionValue, setConditionValue] = useState('');
  const [linkValue, setLinkValue] = useState();
  const handleClick = (e, titleProps, currentField) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
    setInputValue(getValues(currentField)?.linkLabel || '');
    setConditionValue(getValues(currentField)?.condition || '');
    setLinkValue(getValues(currentField)?.link || '');
  };
  const handleInputChange = (e, currentField) => {
    setInputValue(e.target.value);
    handleOnDropdownChange(
      null,
      { value: getValues(currentField).states || [] },
      currentField,
      e.target.value,
    );
  };
  const handleInputLinkChange = (e, currentField) => {
    setLinkValue(e.target.value);
    handleOnDropdownChange(
      null,
      { value: getValues(currentField).states || [] },
      currentField,
      undefined,
      undefined,
      e.target.value,
    );
  };
  const handleInputConditionChange = (e, currentField) => {
    setConditionValue(e.target.value);
    handleOnDropdownChange(
      null,
      { value: getValues(currentField).states || [] },
      currentField,
      undefined,
      e.target.value,
    );
  };
  return (
    <Segment
      style={{
        width: '100%',
        paddingBottom:
          request?.data?.fieldsets[0]?.fields.length > 9 ? '120px' : '',
        height: COMPONENT_HEIGHT,
        overflow: 'auto',
      }}
    >
      <Accordion styled fluid>
        {request?.loaded &&
          !request?.loading &&
          requestStateOptions?.loaded &&
          !requestStateOptions?.loading &&
          requestStateOptions?.data &&
          fields.map((currentField, index) => {
            if (
              request.data.required.includes(currentField) ||
              getDropdownValues(currentField) === undefined
            )
              return null;
            return (
              <React.Fragment key={`${currentField}${index}`}>
                <Accordion.Title
                  active={activeIndex === index}
                  index={index}
                  onClick={(e, titleProps) =>
                    handleClick(e, titleProps, currentField)
                  }
                  id={`property_${currentField}`}
                >
                  <div className="title-editing-progress">
                    <Icon name="dropdown" size="tiny" />
                    &nbsp;
                    {currentField}
                  </div>
                  <div className="title-editing-progress">
                    <Icon
                      name="cancel"
                      size="mini"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOnDropdownChange(
                          e,
                          { value: undefined },
                          currentField,
                        );
                      }}
                    />
                  </div>
                </Accordion.Title>
                <Accordion.Content
                  active={activeIndex === index}
                  id={`property_content_${currentField}`}
                >
                  <label
                    htmlFor="message"
                    style={{ display: 'block', padding: '10px' }}
                  >
                    Message
                  </label>
                  <input
                    className="message-input"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e, currentField)}
                    // ref={inputRef}
                    name="message"
                    style={{ padding: '10px' }}
                    disabled={getDropdownValues(currentField) == null}
                    placeholder="Write a dfferent message after you set at lest one state"
                  />
                  <label
                    htmlFor="message"
                    style={{ display: 'block', padding: '10px' }}
                  >
                    Link
                  </label>
                  <input
                    className="link-input"
                    value={linkValue}
                    onChange={(e) => handleInputLinkChange(e, currentField)}
                    // ref={inputRef}
                    name="link"
                    style={{ padding: '10px' }}
                    disabled={getDropdownValues(currentField) == null}
                    placeholder="Write a dfferent href link"
                  />
                  <label
                    htmlFor="condition"
                    style={{ display: 'block', padding: '10px' }}
                  >
                    Condition
                  </label>
                  <input
                    className="condition-input"
                    value={conditionValue}
                    onChange={(e) =>
                      handleInputConditionChange(e, currentField)
                    }
                    // ref={inputRef}
                    name="condition"
                    style={{ padding: '10px' }}
                    disabled={getDropdownValues(currentField) == null}
                    placeholder="Write a dfferent condition"
                  />
                  <label
                    htmlFor="dropdown"
                    style={{ display: 'block', padding: '10px' }}
                  >
                    States
                  </label>
                  <Dropdown
                    placeholder="Fields"
                    multiple
                    floating
                    selection
                    search
                    name="dropdown"
                    defaultValue={getDropdownValues(currentField)}
                    options={[
                      ...createStateOption(
                        requestStateOptions.data.items.map(
                          (option) => option.token,
                        ),
                      ),
                    ]}
                    onChange={(e, data) =>
                      handleOnDropdownChange(e, data, currentField)
                    }
                    renderLabel={renderLabel}
                  />
                </Accordion.Content>
              </React.Fragment>
            );
          })}
      </Accordion>
    </Segment>
  );
};

export default EditDataComponent;
