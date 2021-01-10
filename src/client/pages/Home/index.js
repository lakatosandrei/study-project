import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
// import { isEmail } from 'validator';

import Layout from 'components/Layout';

import * as action from './action';

let Home = ({ history, handleSubmit, joinAction, route: { title }, global: { accessToken, user }, }) => {
  const onSubmit = async (value) => {
    joinAction(value);
  };

  if (accessToken && user) {
    return <Redirect to='/jobs' />;
  }

  return (
    <Layout title={title} returnPath='/' showSidebar={true}>

      <button className='login-button' onClick={() => history.push('/login')}>
        Login
      </button>

      <h4 className='text-center'>Buna Ziua! Daca doriti sa participati la studiu compleati datele cerute si apasati butonul Participa</h4>

      <div className='row'>
        <div className='col col-md-6 offset-md-3'>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='form-group'>
              <b>
                <label htmlFor='name'>Nume si prenume</label>
              </b>
              <Field
                id='name'
                name='name'
                type='text'
                component='input'
                placeholder='Nume si prenume'
                className='form-control'
              />
            </div>

            <div className='form-group'>
              <b>
                <label htmlFor='age'>Varsta</label>
              </b>
              <Field
                id='age'
                name='age'
                type='number'
                component='input'
                placeholder='Varsta'
                className='form-control'
              />
            </div>

            <div className='form-group'>
              <b>
                <label htmlFor='studies'>Ultimele studii absolvite</label>
              </b>
              <Field
                id='studies'
                name='studies'
                type='text'
                component='input'
                placeholder='Ultimele studii absolvite'
                className='form-control'
              />
            </div>

            <div className='form-group'>
              <b>
                <label htmlFor='studies'>Sex</label>
              </b>

              <div>
                <label htmlFor='sex-male'>Barbat</label>
                <Field
                  id='sex-male'
                  name='sex'
                  type='radio'
                  component='input'
                  className='form-control custom-radio'
                  value='male'
                />
              </div>

              <div>
                <label htmlFor='sex-female'>Femeie</label>
                <Field
                  id='sex-female'
                  name='sex'
                  type='radio'
                  component='input'
                  className='form-control custom-radio'
                  value='female'
                />
              </div>

            </div>

            <button type='submit' className='btn btn-primary btn-block'>
              Participa
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

Home = reduxForm({
  form: 'Home',
})(Home);

const mapStateToProps = ({ global, login }) => ({
  global,
  login,
});

const mapDispatchToProps = {
  joinAction: action.joinAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
