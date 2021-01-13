import React, { useEffect } from 'react';
import ReactSlider from 'react-slider';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Layout from 'components/Layout';

import * as action from 'pages/Home/action';
import './index.scss';

const feels = ['interesat', 'exaltat', 'puternic', 'entuziast', 'mandru', 'alert', 'inspirat', 'determinat', 'atent', 'activ', 'stresat', 'suparat', 'vinovat', 'infricosat', 'ostil', 'iritbail', 'rusinat', 'agitat', 'nervos', 'speriat'];

const characteristics = ['angajabila', 'placuta', 'agreabila', 'onesta', 'muncitoare', 'inteligenta', 'dinamica', 'are o fata atractiva'];

let Questionnaire = ({
  handleSubmit,
  updateParticipant,
  cv,
  change,
  initialValues,
  global: { participant }
}) => {
  const onSubmit = async (value) => {
    updateParticipant({
      ...participant,
      reviewed: [
        ...participant.reviewed,
        {
          cv_id: cv._id,
          job_id: cv.project_id,
          ...value
        }
      ]
    });
  };

  return (
    <Layout title='Questionnaire' showSidebar={false}>
      <h1 className='text-center'>Studiu</h1>

      <div className='row'>
        <div className='col col-md-12'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Gandindu-va la Dvs., in ce masura va simtiti acum:
            </label>

            <h4>
              De la deloc (1) pana la foarte mult (5)
            </h4>
            {feels && feels.map((feel, index) => (
              <div key={index} className='form-group'>
                <b>
                  <label htmlFor='title'>{feel}</label>
                </b>
                <Field
                  id={feel}
                  name={feel}
                  component='input'
                  min={1}
                  max={5}
                  type='number'
                  placeholder={feel}
                  className='form-control'
                />
              </div>
            ))}

            <label>
              Marcati cu patratul de pe segment 0-10, masura in care considerati ca fiecare dintre urmatoarele aspecte este caracteristic perspoanei al carei CV l-ati studiat anterior:
            </label>

            {
              characteristics && characteristics.map((char, index) => (
                <div key={index} className='form-group'>
                  <b>
                    <label htmlFor='title'>{char}</label>
                  </b>
                  <ReactSlider
                    min={1}
                    step={0.1}
                    max={10}
                    className="horizontal-slider"
                    thumbClassName="example-thumb"
                    trackClassName="example-track"
                    defaultValue={initialValues[char]}
                    onChange={(value) => {
                      change(char, value);
                    }}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                  />
                  <Field
                    id={char}
                    name={char}
                    component='input'
                    min={1}
                    max={10}
                    type='number'
                    placeholder={char}
                    className='form-control'
                  />
                </div>
              ))
            }

            <div className='form-group'>
              <b>
                <label htmlFor='studies'>Ati angaja aceasta persoana?</label>
              </b>

              <div>
                <label htmlFor='hire-yes'>Da</label>
                <Field
                  id='hire-yes'
                  name='hire'
                  type='radio'
                  component='input'
                  className='form-control custom-radio'
                  value={true}
                />
              </div>

              <div>
                <label htmlFor='hire-no'>Nu</label>
                <Field
                  id='hire-no'
                  name='hire'
                  type='radio'
                  component='input'
                  className='form-control custom-radio'
                  value={false}
                />
              </div>

            </div>

            <div className='form-group'>
              <b>
                <label htmlFor='reason'>De ce (justificati alegerea dumneavoastra) ?</label>
              </b>

              <Field
                id='reason'
                name='reason'
                type='reason'
                component='textarea'
                placeholder='Justificati'
                className='form-control'
              />
            </div>

            <button type='submit' className='btn btn-primary btn-block'>
              Salveaza opinie
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};


Questionnaire = reduxForm({
  form: 'Questionnaire',
  enableReinitialize: true
})(Questionnaire);

const mapStateToProps = ({ global, cvReducer: { cvDetail: { cv } } }) => ({
  global,
  cv,
  initialValues: {
    ...feels.reduce((obj, feel) => {
      // eslint-disable-next-line
      obj[feel] = 5;
      return obj;
    }, {}),
    ...characteristics.reduce((obj, char) => {
      // eslint-disable-next-line
      obj[char] = 10;
      return obj;
    }, {}),
    hire: false,
    reason: '',
  }
});

const mapDispatchToProps = {
  updateParticipant: action.updateParticipant
};

export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire);
