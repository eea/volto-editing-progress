import React, { useEffect } from 'react';
import { Segment, List, Dropdown } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import { useSelector, useDispatch } from 'react-redux';
import { getRawContent } from './actions';
import { COMPONENT_HEIGHT } from './VisualJSONWidget';

function makeFirstLetterCapital(string) {
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
        .find((rule) => rule.prefix === currentField)
        ?.states.map((state) => makeFirstLetterCapital(state));

    return undefined;
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
          requestStateOptions?.loaded &&
          !requestStateOptions?.loading &&
          requestStateOptions?.data &&
          request?.data?.fieldsets[0]?.fields?.map((currentField) => {
            if (request.data.required.includes(currentField)) return null;
            return (
              <List.Item key={currentField}>
                <List.Content
                  floated="right"
                  verticalAlign="middle"
                  style={{ paddingTop: '10px' }}
                >
                  <Dropdown
                    placeholder="Fields"
                    multiple
                    floating
                    selection
                    search
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
                </List.Content>
                <List.Content
                  style={{ fontSize: '1.75rem', padding: '15px' }}
                  verticalAlign="middle"
                >
                  {currentField}
                </List.Content>
              </List.Item>
            );
          })}
      </List>
    </Segment>
  );
};

export default EditDataComponent;
