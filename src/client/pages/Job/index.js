import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import Paginate from 'react-paginate';

import Layout from 'components/Layout';

// import image from 'assets/image.png';
import { formatDate } from 'utils';
import * as action from './action';
import './styles.scss';

const Job = ({
  route: { title },
  job: {
    jobs,
    metaData: { total },
  },
  getJobsAction,
}) => {
  useEffect(() => {
    getJobsAction();
  }, []);

  return (
    <Layout title={title} needLogin>
      {jobs.map((job) => (
        <div key={job._id} className='job__item'>
          <div>
            {`${formatDate(job.publishAt)} - Published by `}
            <code>
              <b>{job.user?.name}</b>
            </code>
          </div>

          <Link to={`/job/${job._id}`} className='job__title'>
            <h3>{job.title}</h3>
          </Link>

          <p className='job__description'>{job.description}</p>
        </div>
      ))}

      {
        total === 0 && (
          <h2>
            Nu exista un post momentan, te rog adauga unul.
          </h2>
        )
      }

      <div className='row flex-nowrap justify-content-center'>
        <button className='btn btn-primary btn-block col-6'>
          <NavLink
            className='nav-link no-href'
            to='/create-job'>
            Adauga
          </NavLink>
        </button>
      </div>
    </Layout>
  );
};

const mapStateToProps = ({ jobReducer: { job } }) => ({ job });

const mapDispatchToProps = {
  getJobsAction: action.getJobsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Job);
