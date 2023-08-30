import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { getEditingProgress } from './actions';
import './less/editor.less';
import { Plug } from '@plone/volto/components/manage/Pluggable';
import { getBaseUrl, flattenToAppURL } from '@plone/volto/helpers';

const filter_remaining_steps = (values, key) => {
  return values.filter((value) => {
    const is_not_ready = !value.is_ready;
    if (!is_not_ready) {
      return false;
    }
    const states = value.states;
    const required_for_all = states?.indexOf('all') !== -1;
    return (
      (is_not_ready && required_for_all) ||
      (is_not_ready && states?.indexOf(key) !== -1)
    );
  });
};

/**
 * @summary The React component that shows editing progress of required fields per active workflow state of selected content.
 */
const EditingProgress = (props) => {
  const { content, pathname, token } = props;
  const dispatch = useDispatch();
  const isAuth = !!token;
  const contentId = content?.['@id'] || '';

  const sideMenuRef = useRef(null);

  const basePathname = getBaseUrl(pathname);
  const contentContainsPathname =
    contentId && basePathname && contentId.endsWith(basePathname);
  const isEdit = pathname.endsWith('/edit');
  const fetchCondition =
    pathname.endsWith('/contents') || isEdit || pathname === basePathname;

  const currentStateKey = content?.review_state;

  const editingProgressSteps = useSelector((state) => {
    if (isAuth && state?.editingProgress?.editing?.loaded === true) {
      return state?.editingProgress?.result?.steps;
    }
    return null;
  });

  const toggleEditingSidebar = () => {
    sideMenuRef.current && sideMenuRef.current.classList.toggle('is-hidden');
  };

  useEffect(() => {
    if (isAuth && fetchCondition && contentContainsPathname) {
      dispatch(getEditingProgress(basePathname));
    }
  }, [dispatch, isAuth, basePathname, fetchCondition, contentContainsPathname]);
  return isAuth &&
    contentContainsPathname &&
    editingProgressSteps &&
    editingProgressSteps.length ? (
    <>
      <Plug
        pluggable="active-workflow-progress"
        id="style"
        key={editingProgressSteps}
      >
        {() => {
          const remaining_steps = filter_remaining_steps(
            editingProgressSteps,
            currentStateKey,
          );

          return (
            <div className={'ep-sidenav-wrapper'}>
              <Button
                className={'ep-sidenav-btn'}
                onClick={toggleEditingSidebar}
              >
                {remaining_steps.length} fields missing
              </Button>
              <ul
                className={'sidenav-ol sidenav-ol--ep is-hidden'}
                ref={sideMenuRef}
              >
                {remaining_steps.map((step, index) => {
                  return (
                    <li className={'ep-sidenav-li'} key={step['link_label']}>
                      <a
                        href={flattenToAppURL(step['link'])}
                        className={'ep-sidenav-a'}
                      >
                        {step['link_label']}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }}
      </Plug>
    </>
  ) : null;
};

EditingProgress.propTypes = {
  content: PropTypes.object,
};

export default EditingProgress;
