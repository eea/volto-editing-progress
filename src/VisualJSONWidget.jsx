import React, { useState } from 'react';
import { ModalForm } from '@plone/volto/components';
import { addSchemaModal, JSONSchema } from './schema';
import { Button, Header, Container, Segment, Divider } from 'semantic-ui-react';
import _ from 'lodash';
import { FormattedMessage, defineMessages } from 'react-intl';
const messages = defineMessages({
  addcontentType: {
    id: 'Add contentType',
    defaultMessage: 'Add contentType',
  },
  editcontentType: {
    id: 'Edit contentType',
    defaultMessage: 'Edit contentType',
  },
  jsonTitle: {
    id: 'Edit JSON',
    defaultMessage: 'Edit JSON',
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

const VisualJSONWidget = (props) => {
  const { id, value = {}, onChange } = props;
  const [isVisualModalOpen, setIsVisualModalOpen] = useState(false);
  const [isJSONEditorOpen, setIsJSONEditorOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [modalTitle, setModalTitle] = useState(
    props.intl.formatMessage(messages.addcontentType),
  );

  const onSubmit = (e) => {
    //Deleting the Content Type from the "value" so that the Content Type title can be changed
    const duplicateValue = { ...value };
    delete duplicateValue[modalData.contentType];
    e.state = e.state.map((i) => {
      //Delete the @id key that formModal volto component automatically adds to keep the json clean
      delete i?.['@id'];
      //The tag "states" needs to be an array, so we split the string on ","
      if (!Array.isArray(i.states)) {
        i.states = i.states?.split(',');
      }
      return i;
    });
    const localData = { [e.contentType]: e.state };
    onChange(id, { ...duplicateValue, ...localData });
    setIsVisualModalOpen(false);
  };

  const handleEditcontentType = (e, name) => {
    e.preventDefault();
    // Add @id key with a unique id to every state. It is required by the formModal volto component.
    const dataForModal = value[name].map((state) => {
      return { ...state, ...{ '@id': _.uniqueId('modal_') } };
    });
    setModalData({ contentType: name, state: dataForModal });
    setIsVisualModalOpen(true);
    setModalTitle(props.intl.formatMessage(messages.editcontentType));
  };
  const handleAddcontentType = (e) => {
    e.preventDefault();
    setIsVisualModalOpen(true);
    setModalData({});
    setModalTitle(props.intl.formatMessage(messages.addcontentType));
  };
  const handleDeletecontentType = (e, name) => {
    e.preventDefault();
    delete value[name];
    onChange(id, value);
  };
  const handleOnCancel = (e) => {
    setIsVisualModalOpen(false);
    setIsJSONEditorOpen(false);
  };
  const handleEditJSON = (e) => {
    e.preventDefault();
    setModalTitle(props.intl.formatMessage(messages.jsonTitle));
    setIsJSONEditorOpen(true);
  };
  const onJSONSubmit = (e) => {
    setIsJSONEditorOpen(false);
    if (isValidJson(e.json)) {
      onChange(id, JSON.parse(e.json));
    }
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
        {isVisualModalOpen && (
          <ModalForm
            schema={addSchemaModal(props)}
            onSubmit={onSubmit}
            title={modalTitle}
            open={isVisualModalOpen}
            formData={modalData}
            onCancel={handleOnCancel}
            key="Visual"
          />
        )}
        <Container>
          <Button onClick={handleAddcontentType}>
            <FormattedMessage
              id="Add Content Type"
              defaultMessage="Add Content Type"
            />
          </Button>
          <Button onClick={handleEditJSON} color="grey">
            <FormattedMessage id="Edit JSON" defaultMessage="Edit JSON" />
          </Button>
        </Container>
        <Divider />
        <Container>
          {Object.keys(value).map((entry) => (
            <Segment key={_.uniqueId('key_')}>
              <Header as="h2">{entry}</Header>
              <Button onClick={(e) => handleEditcontentType(e, entry)} primary>
                <FormattedMessage
                  id="Edit Content Type"
                  defaultMessage="Edit Content Type"
                />
              </Button>
              <Button
                onClick={(e) => handleDeletecontentType(e, entry)}
                secondary
              >
                <FormattedMessage
                  id="Delete Content Type settings"
                  defaultMessage="Delete Content Type settings"
                />
              </Button>
            </Segment>
          ))}
        </Container>
      </div>
    </>
  );
};
export default VisualJSONWidget;
