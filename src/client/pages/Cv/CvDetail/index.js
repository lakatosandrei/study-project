import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactMde from 'react-mde';
import moment from 'moment-timezone';

import Layout from 'components/Layout';
import MdViewer, { makeEmojiHtml } from 'components/MdViewer';

import * as action from './action';
import '../styles.scss';

const CvDetail = ({
  match: { params },
  global: { accessToken },
  cvDetail: { cv, cvs, error },
  getCvDetailAction,
  getCvsForCvAction,
  updateCvAction
}) => {
  const { _id } = params;

  useEffect(() => {
    if (_id) {
      getCvDetailAction(_id);
    }

    if (_id) {
      getCvsForCvAction(_id);
    }

    if (error) {
      toast.error(error?.message);
    }
  }, []);

  const [profilePicture, setProfilePicture] = useState('');

  const [name, setNameCv] = useState('');

  const onNameCvChange = ({ target: { value } }) => setNameCv(value);

  const [gender, setGender] = useState('');

  const onGenderCvChange = ({ target: { value } }) => setGender(value);

  const [age, setAge] = useState('');

  const onAgeCvChange = ({ target: { value } }) => setAge(value);

  const [maritalStatus, setMaritalStatus] = useState('');

  const onMaritalStatusCvChange = ({ target: { value } }) => setMaritalStatus(value);

  const [selectedTab, setSelectedTab] = useState('preview');

  const [education, setEducation] = useState(cv?.education);

  const onEducationInputChange = (value) => {
    setEducation(value);
  };

  const [skills, setSkills] = useState(cv?.education);

  const onSkillsInputChange = (value) => {
    setSkills(value);
  };

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

  useEffect(() => {
    if (cv) {
      setProfilePicture(cv.profilePicture);
      setNameCv(cv.name)
      setGender(cv.gender);
      setAge(cv.age);
      setMaritalStatus(cv.maritalStatus);
      setEducation(cv.education);
      setSkills(cv.skills);
    }
  }, [cv]);

  const updateCv = () => {
    updateCvAction({
      ...cv,
      name,
      gender,
      age,
      maritalStatus,
      profilePicture,
      education,
      skills
    }, cv.project_id);
  };

  return (
    <Layout title={cv?.name || ''}>
      <div className='cv__item cv__item__detail'>
        <div className='cv__item__field'>
          <label htmlFor='profilePicture-cv'>
            Poza de profil
          </label>

          <img src={profilePicture} />

          <input
            id="profilePicture-cv"
            type="file"
            inputProps={{ accept: 'image/*' }}
            label="Poza de profil"
            name="profilePicture"
            onChange={e => handlePictureUpload(e)}
            size="small"
            variant="standard"
          />
        </div>

        <div className='cv__item__field'>
          <label htmlFor='name-cv'>
            Nume
          </label>

          <input
            id='name-cv'
            className='form-control'
            placeholder='Nume'
            value={name}
            onChange={onNameCvChange}
          />
        </div>

        <div className='cv__item__field'>
          <label htmlFor='gender-cv'>
            Gen
          </label>

          <select name="gender-cv" id="gender-cv" value={gender} onChange={onGenderCvChange}>
            <option value="male">Barbat</option>
            <option value="female">Femeie</option>
          </select>

        </div>

        <div className='cv__item__field'>
          <label htmlFor='age-cv'>
            Varsta
          </label>

          <input
            id='age-cv'
            className='form-control'
            placeholder='Varsta'
            type='number'
            value={age}
            onChange={onAgeCvChange}
          />
        </div>

        <div className='cv__item__field'>
          <label htmlFor='maritalStatus-cv'>
            Statut marital
          </label>

          <select name="maritalStatus-cv" id="maritalStatus-cv" value={maritalStatus} onChange={onMaritalStatusCvChange}>
            <option value="male">Barbat</option>
            <option value="female">Femeie</option>
          </select>

        </div>

      </div>

      <hr />

      {cv && (
        <div className='cv__container'>
          <h5>Responsabilitati si sarcini</h5>

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
            <button className='btn btn-primary btn-block col-6 m-2' onClick={() => updateCv()}>
              <NavLink
                className='nav-link no-href'
                to={`/create-cv/${cv?._id}`}>
                Adauga CV
              </NavLink>
            </button>

            <button className='btn btn-primary btn-block col-6 m-2' onClick={() => updateCv()}>
              Salveaza CV
            </button>
          </div>

        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = ({ global, cvReducer: { cvDetail } }) => ({
  global,
  cvDetail,
});

const mapDispatchToProps = {
  getCvDetailAction: action.getCvDetailAction,
  getCvsForCvAction: action.getCvsForCvAction,
  updateCvAction: action.updateCvAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CvDetail);
