import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactMde from 'react-mde';
import moment from 'moment-timezone';
import { DraggableHandle, SortableItem, SortableList } from 'pages/Cv';
import arrayMove from 'array-move';
import throttle from 'lodash/throttle';

import Layout from 'components/Layout';
import MdViewer, { makeEmojiHtml } from 'components/MdViewer';
import { formatDate } from 'utils';

import * as action from './action';
import * as cvAction from '../../Cv/action';
import '../styles.scss';
import cvReducer from 'pages/Cv/reducer';

const GENDER_MAP = {
  'male': 'Barbat',
  'female': 'Femeie'
};

const JobDetail = ({
  match: { params },
  global: { accessToken },
  jobDetail: { job, cvs, error },
  loadCvs,
  getJobDetailAction,
  getCvsForJobAction,
  deleteCvAction,
  updateJobAction,
  updateCvsAction
}) => {
  const { _id } = params;

  useEffect(() => {
    if (_id) {
      getJobDetailAction(_id);
    }

    if (_id) {
      getCvsForJobAction(_id);
    }

    if (error) {
      toast.error(error?.message);
    }
  }, []);

  useEffect(() => {
    if (loadCvs) {
      if (_id) {
        getCvsForJobAction(_id);
      }
    }
  }, [loadCvs]);

  const [titleJob, setTitleJob] = useState('');

  const onTitleJobChange = ({ target: { value } }) => setTitleJob(value);

  const [description, setDescription] = useState('');

  const onDescriptionChange = ({ target: { value } }) => setDescription(value);

  const [source, setSource] = useState(job?.content);

  useEffect(() => {
    if (job) {
      setSource(job.content);
      setTitleJob(job.title)
      setDescription(job.description);
    }
  }, [job]);

  const [selectedTab, setSelectedTab] = useState('preview');

  const onInputChange = (value) => {
    setSource(value);
  };

  const updateJob = () => {
    updateJobAction({
      ...job,
      description,
      content: source,
      title: titleJob,
    })
  };

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (cvs) {
      setItems(cvs);
    }
  }, [cvs]);

  const updateCvs = throttle((newCvs) => {
    updateCvsAction(newCvs);
  }, 500, { trailing: true });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const cachedOrder = items[oldIndex].order;

    items[oldIndex].order = items[newIndex].order;

    items[newIndex].order = cachedOrder;

    const newCvs = arrayMove(items, oldIndex, newIndex);

    setItems(newCvs);
    updateCvs(newCvs);
  };

  return (
    <Layout title={job?.title || ''}>
      <div className='job__item job__item__detail'>
        <div className='job__item__field'>
          <label htmlFor='title-job'>
            Titlu
          </label>

          <input
            id='title-job'
            className='form-control'
            placeholder='Titlu'
            value={titleJob}
            onChange={onTitleJobChange}
          />
        </div>

        <div className='job__item__field'>
          <label htmlFor='description-job'>
            Descriere
          </label>

          <input
            id='description-job'
            className='form-control'
            placeholder='Descriere'
            value={description}
            onChange={onDescriptionChange}
          />
        </div>

      </div>

      <hr />

      {job && (
        <div className='cv__container'>
          <h5>Responsabilitati si sarcini</h5>

          {accessToken && (
            <>
              <ReactMde
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                onChange={onInputChange}
                value={source}
                generateMarkdownPreview={async (markdown) => {
                  const html = makeEmojiHtml(markdown);

                  return html;
                }}
              />
            </>
          )}

          <h4 className='job__item__detail__cv-list__title'>Lista CV-uri</h4>

          <SortableList
            useDragHandle
            className='job__item__detail__cv-list'
            items={items}
            onSortEnd={onSortEnd}
            renderItem={(cv, index) => (
              <SortableItem key={`cv-item-${index}`} index={index}>
                <div key={cv._id} className='cv__item'>
                  <div className='cv__item__buttons'>
                    <DraggableHandle />
                    <div className='cv__item__buttons__delete' onClick={() => deleteCvAction(cv._id)}>
                      <i className='fa fa-trash' />
                    </div>
                  </div>
                  <div className='cv__item__content'>
                    <div>
                      {`${formatDate(cv.publishAt)}`}
                    </div>

                    <Link to={`/cv/${cv._id}`} className='cv__title'>
                      <h3>{cv.name}</h3>
                    </Link>

                    <p className='cv__description'>
                      <label>
                        Gen:
                      </label>
                      {GENDER_MAP[cv.gender]}
                    </p>

                    <p className='cv__description'>
                      <label>
                        Varsta:
                      </label>
                      {cv.age}
                    </p>

                  </div>
                </div>
              </SortableItem>
            )}
          />

          <div className='row flex-nowrap justify-content-center m-5'>
            <button className='btn btn-primary btn-block col-6 m-2' onClick={() => updateJob()}>
              <NavLink
                className='nav-link no-href'
                to={`/create-cv/${job?._id}`}>
                Adauga CV
              </NavLink>
            </button>

            <button className='btn btn-primary btn-block col-6 m-2' onClick={() => updateJob()}>
              Salveaza Post
            </button>
          </div>

        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = ({ global, jobReducer: { jobDetail }, cvReducer: { cv: { loadCvs } } }) => ({
  global,
  jobDetail,
  loadCvs
});

const mapDispatchToProps = {
  getJobDetailAction: action.getJobDetailAction,
  getCvsForJobAction: action.getCvsForJobAction,
  updateCvsAction: cvAction.updateCvsAction,
  deleteCvAction: cvAction.deleteCvAction
};

export default connect(mapStateToProps, mapDispatchToProps)(JobDetail);
