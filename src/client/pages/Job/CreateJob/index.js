/* @flow */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ReactMde from 'react-mde';
import { toast } from 'react-toastify';

import Layout from 'components/Layout';
import TagsInput from 'components/TagsInput';
import { makeEmojiHtml } from 'components/MdViewer';

import * as action from './action';

import './styles.scss';

const CreateJob = ({
  route: { title },
  createJob: { job, error },
  createJobAction,
  deleteLocalJobAction,
}) => {
  useEffect(() => {
    if (error) {
      toast.error(error?.message);
    }

    return () => {
      deleteLocalJobAction();
    };
  }, [error]);

  const [titleJob, setTitleJob] = useState('');

  const onTitleJobChange = ({ target: { value } }) => setTitleJob(value);

  const [description, setDescription] = useState('');

  const onDescriptionChange = ({ target: { value } }) => setDescription(value);

  const [source, setSource] = useState('');

  const [selectedTab, setSelectedTab] = useState('write');

  const onInputChange = (value) => {
    setSource(value);
  };

  const onPublish = () => {
    createJobAction({
      title: titleJob,
      description,
      content: source,
    });
  };

  if (job) {
    return <Redirect to='/' />;
  }

  return (
    <Layout title={title} needLogin className='create__job__container'>
      <input
        className='form-control'
        placeholder='Titlu'
        value={titleJob}
        onChange={onTitleJobChange}
      />

      <input
        className='form-control'
        placeholder='Descriere'
        value={description}
        onChange={onDescriptionChange}
      />

      <label>
        Cerintele postului
      </label>

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

      <button
        className='btn btn-block btn-primary btn-publish'
        onClick={onPublish}>
        Publish
      </button>
    </Layout>
  );
};

const mapStateToProps = ({ global, jobReducer: { createJob } }) => ({
  global,
  createJob,
});

const mapDispatchToProps = {
  createJobAction: action.createJobAction,
  deleteLocalJobAction: action.deleteLocalJobAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateJob);
