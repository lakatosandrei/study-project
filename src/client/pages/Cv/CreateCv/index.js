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
import { Field } from 'redux-form';

const CreateCv = ({
  match: { params },
  route: { title },
  createCv: { cv, error },
  createCvAction,
  deleteLocalCvAction,
}) => {
  const { _id: projectId } = params;

  useEffect(() => {
    if (error) {
      toast.error(error?.message);
    }

    return () => {
      deleteLocalCvAction();
    };
  }, [error]);

  const [name, setName] = useState('');

  const onNameCvChange = ({ target: { value } }) => setName(value);

  const [age, setAge] = useState('');

  const onAgeCvChange = ({ target: { value } }) => setAge(value);

  const [gender, setGender] = useState('male');

  const onGenderCvChange = ({ target: { value } }) => setGender(value);

  const [maritalStatus, setMaritalStatus] = useState('unmarried');

  const onMaritalStatusCvChange = ({ target: { value } }) => setMaritalStatus(value);

  const [education, setEducation] = useState('');

  const [skills, setSkills] = useState('');

  const [selectedTab, setSelectedTab] = useState('write');

  const onEducationInputChange = (value) => {
    setEducation(value);
  };

  const onSkillsInputChange = (value) => {
    setSkills(value);
  };

  const [profilePicture, setProfilePicture] = useState('');

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        reject(err);
      }
    })
  };

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);

    setProfilePicture(base64);
  };

  const onPublish = () => {
    createCvAction({
      name,
      gender,
      age,
      maritalStatus,
      profilePicture,
      education,
      skills
    }, projectId);
  };

  if (cv) {
    return <Redirect to='/' />;
  }

  const options = [{
    value: 'unmarried',
    label: 'Necasatorit',
  }, {
    value: 'married',
    label: 'Casatorit',
  }].map(opt => gender === 'male' ? opt : {
    ...opt,
    label: `${opt.label}a`,
  });

  return (
    <Layout title={title} needLogin className='create__cv__container'>

      {profilePicture && (<img src={profilePicture} />)}

      <div>
        <label htmlFor="profilePicture">Poza de profil:</label>
        <input
          id="profilePicture"
          type="file"
          accept='image/*'
          label="Poza de profil"
          name="profilePicture"
          onChange={e => handlePictureUpload(e)}
          size="small"
          variant="standard"
        />
      </div>

      <div>
        <label htmlFor="name">Nume:</label>
        <input
          className='form-control'
          name='name'
          id='name'
          placeholder='Nume'
          value={name}
          onChange={onNameCvChange}
        />
      </div>

      <div>
        <label htmlFor="gender">Gen:</label>

        <select name="gender" id="gender" value={gender} onChange={onGenderCvChange}>
          <option value="male">Barbat</option>
          <option value="female">Femeie</option>
        </select>
      </div>

      <div>
        <label htmlFor="gender">Varsta:</label>
        <input
          className='form-control'
          name='name'
          id='name'
          placeholder='Varsta'
          value={age}
          type='number'
          onChange={onAgeCvChange}
        />
      </div>

      <div>
        <label htmlFor="maritalStatus">Statut marital:</label>

        <select name="maritalStatus" id="maritalStatus" value={maritalStatus} onChange={onMaritalStatusCvChange}>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <label>
        Educatie
      </label>

      <ReactMde
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onChange={onEducationInputChange}
        value={education}
        generateMarkdownPreview={async (markdown) => {
          const html = makeEmojiHtml(markdown);

          return html;
        }}
      />

      <label>
        Aptitudini
      </label>

      <ReactMde
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        onChange={onSkillsInputChange}
        value={skills}
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

const mapStateToProps = ({ global, cvReducer: { createCv } }) => ({
  global,
  createCv,
});

const mapDispatchToProps = {
  createCvAction: action.createCvAction,
  deleteLocalCvAction: action.deleteLocalCvAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCv);
