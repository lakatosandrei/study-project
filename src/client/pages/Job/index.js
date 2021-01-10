import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
    metaData: { index: page, total },
  },
  getJobsAction,
}) => {
  useEffect(() => {
    if (!jobs || jobs.length === 0) {
      getJobsAction();
    }
  }, []);

  const onPageChange = ({ selected: skip }) => {
    getJobsAction(skip);
  };

  return (
    <Layout title={title}>
      {jobs.map((job) => (
        <div key={job._id} className='job__item'>
          <div>
            {`${formatDate(job.publishAt)} - Published by `}
            <code>
              <b>{job.user?.name}</b>
            </code>
          </div>

          <Link to={`/p/${job._id}`} className='job__title'>
            <h3>{job.title}</h3>
          </Link>

          <p className='job__description'>{job.description}</p>

          <div className='tag__group'>
            {job.tags.map((tag, i) => (
              <Link to={`/tags/${tag}`} key={i} className='tag__item'>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <Paginate
        pageCount={total}
        marginPagesDisplayed={3}
        pageRangeDisplayed={5}
        initialPage={page}
        previousLabel={<i className='fa fa-angle-left'></i>}
        nextLabel={<i className='fa fa-angle-right'></i>}
        onPageChange={onPageChange}
        disableInitialCallback
        containerClassName={'pagination row'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
      />
    </Layout>
  );
};

const mapStateToProps = ({ jobReducer: { job } }) => ({ job });

const mapDispatchToProps = {
  getJobsAction: action.getJobsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Job);
