import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
// import { isEmail } from 'validator';

import { mockJoin } from 'pages/Home/action';
import Layout from 'components/Layout';

import * as action from './action';

let Home = ({ history, handleSubmit, updateParticipant, mockJoin, route: { title }, global: { accessToken, user, participant }, }) => {
  const onSubmit = async (value) => {
    updateParticipant(value);
    // mockJoin(value);
  };

  if ((accessToken && user) || participant) {
    return <Redirect to='/study' />;
  }

  return (
    <Layout title={title} returnPath='/'>

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
                <label htmlFor='gener-male'>Barbat</label>
                <Field
                  id='gener-male'
                  name='gener'
                  type='radio'
                  component='input'
                  className='form-control custom-radio'
                  value='male'
                />
              </div>

              <div>
                <label htmlFor='gener-female'>Femeie</label>
                <Field
                  id='gener-female'
                  name='gener'
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
  updateParticipant: action.updateParticipant
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
