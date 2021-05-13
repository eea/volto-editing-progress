import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Portal } from 'react-portal';
import { useDispatch } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { getEditingProgress } from './actions';
import './less/editor.less';
import { Plug } from '@plone/volto/components/manage/Pluggable';

/**
 * @summary The React component that shows editing progress of required fields per active workflow state of selected content.
 */
const EditingProgress = (props) => {
  const { content, pathname } = props;
  const contentId = content?.['@id'] || '';
  const dispatch = useDispatch();
  const isToolbarOpen = true;

  useEffect(() => {
    dispatch(getEditingProgress(contentId)); // the are paths that don't have workflow (home, login etc)
  }, [dispatch, pathname, contentId]);

  return (
    isToolbarOpen && (
      <Portal
        node={__CLIENT__ && document.querySelector('#toolbar .toolbar-actions')}
      >
        <Plug pluggable="active-workflow-progress" id="style">
          {(options) => {
            return <Button>{options.id}</Button>;
          }}
        </Plug>
      </Portal>
    )
  );
};

EditingProgress.propTypes = {
  pathname: PropTypes.string.isRequired,
  content: PropTypes.object,
};

export default EditingProgress;
