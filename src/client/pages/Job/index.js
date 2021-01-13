import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import throttle from 'lodash/throttle';

import Layout from 'components/Layout';

// import image from 'assets/image.png';
import { formatDate } from 'utils';
import * as action from './action';
import './styles.scss';

const SortableItem = SortableElement(({ children }) => <div>{children}</div>);

const SortableList = SortableContainer(({ items, renderItem }) => {
  return (
    <div>
      {items.map((value, index) => renderItem(value, index))}
    </div>
  );
});

const DraggableHandle = SortableHandle(() => <span className='job__item__drag-handle'>::</span>);

const Job = ({
  global: { accessToken, participant },
  route: { title },
  job: {
    jobs,
    loadJobs,
    metaData: { total },
  },
  deleteJobAction,
  getJobsAction,
  updateJobsAction,
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (jobs) {
      setItems(jobs);
    }
  }, [jobs]);

  useEffect(() => {
    getJobsAction(participant);
  }, []);

  useEffect(() => {
    if (loadJobs) {
      getJobsAction(participant);
    }
  }, [loadJobs]);

  const updateJobs = throttle((newJobs) => {
    updateJobsAction(newJobs);
  }, 500, { trailing: true });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const cachedOrder = items[oldIndex].order;

    items[oldIndex].order = items[newIndex].order;

    items[newIndex].order = cachedOrder;

    const newJobs = arrayMove(items, oldIndex, newIndex);

    setItems(newJobs);
    updateJobs(newJobs);
  };

  return (
    <Layout title={title}>
      <SortableList
        useDragHandle
        items={items}
        onSortEnd={onSortEnd}
        renderItem={(job, index) => (
          <SortableItem key={`job-item-${index}`} index={index}>
            <div key={job._id} className='job__item'>
              {
                accessToken && (
                  <div className='job__item__buttons'>
                    <DraggableHandle />
                    <div className='job__item__buttons__delete' onClick={() => deleteJobAction(job._id)}>
                      <i className='fa fa-trash' />
                    </div>
                  </div>
                )
              }
              <div className='job__item__content'>
                <div>
                  {`${formatDate(job.publishAt)}`}
                </div>

                <Link to={`/job/${job._id}`} className='job__title'>
                  <h3>{job.title}</h3>
                </Link>

                <p className='job__description'>{job.description}</p>
              </div>
            </div>
          </SortableItem>
        )}
      />

      {
        accessToken && total === 0 && (
          <h2>
            Nu exista un post momentan, te rog adauga unul.
          </h2>
        )
      }

      {
        !accessToken && total === 0 && (
          <h2>
            Multumim ca ai participat la studiu.
          </h2>
        )
      }

      {accessToken && (
        <div className='row flex-nowrap justify-content-center'>
          <button className='btn btn-primary btn-block col-6'>
            <NavLink
              className='nav-link no-href'
              to='/create-job'>
              Adauga
            </NavLink>
          </button>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = ({ global, jobReducer: { job } }) => ({ global, job });

const mapDispatchToProps = {
  deleteJobAction: action.deleteJobAction,
  getJobsAction: action.getJobsAction,
  updateJobsAction: action.updateJobsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Job);
