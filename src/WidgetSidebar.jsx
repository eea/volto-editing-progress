import React, { useEffect, useState } from 'react';
import { Sidebar, List } from 'semantic-ui-react';
import { SIDEBAR_WIDTH } from './VisualJSONWidget';

export const backgroundColor = (currentContentType, modified) => {
  let color = undefined;
  if (modified) {
    color = 'lightpink';
  }
  if (currentContentType) {
    color = 'lightblue';
  }
  return color;
};

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
            id={`sidebar_${type.id}`}
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

export default SidebarComponent;
