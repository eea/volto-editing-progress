import React, { useEffect, useState } from 'react';
import { Segment, Dropdown, Accordion, Icon } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useSelector, useDispatch } from 'react-redux';
import { getRawContent } from './actions';
import { COMPONENT_HEIGHT } from './VisualJSONWidget';

export function makeFirstLetterCapital(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const EditDataComponent = ({
  request,
  handleOnDropdownChange,
  currentContentType,
  value,
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
  const getMessage = (currentField) => {
    if (
      !request.loading &&
      request.loaded &&
      currentContentType &&
      value[currentContentType.id]
    )
      return (
        value[currentContentType.id].find(
          (rule) => rule?.prefix === currentField,
        )?.message || ''
      );

    return '';
  };
  const renderLabel = (label) => ({
    color: 'blue',
    content: `${label.text}`,
  });

  const createStateOption = (stateOptions) => {
    return stateOptions.map((state) => ({
      key: makeFirstLetterCapital(state),
      text: makeFirstLetterCapital(state),
      value: makeFirstLetterCapital(state),
    }));
  };
  const [activeIndex, setActiveIndex] = useState(0);
  // const inputRef = useRef();
  const [inputValue, setInputValue] = useState('');

  const handleClick = (e, titleProps, currentField) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
    setInputValue(getMessage(currentField));
  };
  const handleInputChange = (e, currentField) => {
    setInputValue(e.target.value);
    handleOnDropdownChange(null, null, currentField, e.target.value);
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
      <Accordion styled fluid>
        {request?.loaded &&
          !request?.loading &&
          requestStateOptions?.loaded &&
          !requestStateOptions?.loading &&
          requestStateOptions?.data &&
          request?.data?.fieldsets[0]?.fields?.map((currentField, index) => {
            if (request.data.required.includes(currentField)) return null;
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
                  <Icon name="dropdown" />
                  {currentField}
                </Accordion.Title>
                <Accordion.Content
                  active={activeIndex === index}
                  id={`property_content_${currentField}`}
                >
                  <>
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
                  </>
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
                    options={createStateOption(
                      requestStateOptions.data.items.map(
                        (option) => option.token,
                      ),
                    )}
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
