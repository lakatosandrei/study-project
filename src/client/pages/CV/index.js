import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactMde from 'react-mde';
import moment from 'moment-timezone';

import Layout from 'components/Layout';
import MdViewer, { makeEmojiHtml } from 'components/MdViewer';

import { formatDate } from 'utils';

import * as action from './action';
import '../styles.scss';

const CV = ({
  match: { params },
  global: { accessToken },
  cvDetail: { age, gender, maritalStatus, error },
  getCVAction
}) => {
  const { _id } = params;

  useEffect(() => {
    if (job?._id !== _id) {
      getCVAction(_id);
    }

    if (error) {
      toast.error(error?.message);
    }
  }, []);

  const [source, setSource] = useState(job?.content);

  useEffect(() => {
    if (job) {
      setSource(job.content);
    }
  }, [job]);

  const [selectedTab, setSelectedTab] = useState('preview');

  const onInputChange = (value) => {
    setSource(value);
  };

  return (
    <Layout title={job?.title || ''}>
      <div className='job__item'>
        <h1 className='job__title'>{job?.title}</h1>

        <label>
          <b>{job?.description}</b>
        </label>
      </div>

      <hr />

      {job && (
        <div className='cv__container'>
          <h5>Responsabilitati si sarcini</h5>

          {!accessToken && (
            <>
              <div className='card cv__login'>
                <div className='card-body text-center'>
                  <Link to='/login'>Login to cv.</Link>
                </div>
              </div>
            </>
          )}

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

          {cvs?.map((cv) => (
            <div className='card cv__item' key={cv._id}>
              <div className='card-body'>
                <div>{cv.user?.name}</div>

                <MdViewer key={cv?._id} source={cv?.cv} />

                <div>
                  {moment(cv.createAt || new Date())
                    .format('MMM DD, YYYY')
                    .toString()}
                </div>
              </div>
            </div>
          ))}

          <div className='row flex-nowrap justify-content-center m-5'>
            <button className='btn btn-primary btn-block col-6'>
              <NavLink
                className='nav-link no-href'
                to='/create-cv'>
                Adauga CV
              </NavLink>
            </button>
          </div>

        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = ({ global, jobReducer: { CV } }) => ({
  global,
  cv,
});

const mapDispatchToProps = {
  getCVAction: action.getCVAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CV);
