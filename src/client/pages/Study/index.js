import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Layout from 'components/Layout';

import * as action from './action';
import { NavLink } from 'react-router-dom';

let Study = ({
  getStudyAction,
  handleSubmit,
  updateStudyAction,
  study,
  global: { accessToken },
  route: { title }
}) => {
  useEffect(() => {
    getStudyAction();
  }, []);

  const onSubmit = async (value) => {
    updateStudyAction(value);
  };

  return (
    <Layout title={title}>
      <h1 className='text-center'>Studiu</h1>

      <div className='row'>
        <div className='col col-md-12'>
          {!accessToken && (
            <div className='m-5'>
              <div className='row flex-column'>
                <b>
                  <label>Title</label>
                </b>
                <h4>{study?.title}</h4>
              </div>
              <div className='row flex-column'>
                <b>
                  <label>Detalii</label>
                </b>
                <h4>{study?.details}</h4>
              </div>
              <button className='btn btn-secondary btn-block m-5'>
                <NavLink
                  className='nav-link no-href'
                  to='/jobs'>
                  Continua
                </NavLink>
              </button>
            </div>
          )}

          {
            accessToken && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group'>
                  <b>
                    <label htmlFor='title'>Title</label>
                  </b>
                  <Field
                    id='title'
                    name='title'
                    type='title'
                    component='input'
                    placeholder='Title'
                    className='form-control'
                  />
                </div>

                <div className='form-group'>
                  <b>
                    <label htmlFor='details'>Detalii despre studiu</label>
                  </b>

                  <Field
                    id='details'
                    name='details'
                    type='details'
                    component='textarea'
                    placeholder='Detalii despre studiu'
                    className='form-control'
                  />
                </div>

                <button type='submit' className='btn btn-primary btn-block'>
                  Salveaza studiu
                </button>
              </form>
            )
          }
        </div>
      </div>
    </Layout>
  );
};


Study = reduxForm({
  form: 'Study',
  enableReinitialize: true
})(Study);

const mapStateToProps = ({ global, studyReducer: { study, error } }) => ({
  global,
  study,
  error,
  initialValues: {
    ...study
  }
});

const mapDispatchToProps = {
  getStudyAction: action.getStudyAction,
  updateStudyAction: action.updateStudyAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Study);
