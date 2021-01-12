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

export const SortableItem = SortableElement(({ children }) => <div>{children}</div>);

export const SortableList = SortableContainer(({ items, renderItem, ...rest }) => {
  return (
    <div {...rest}>
      {items.map((value, index) => renderItem(value, index))}
    </div>
  );
});

export const DraggableHandle = SortableHandle(() => <span className='cv__item__drag-handle'>::</span>);

const Cv = ({
  cv: {
    cvs,
    loadCvs,
    metaData: { total },
  },
  deleteCvAction,
  getCvsAction,
  updateCvsAction,
}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (cvs) {
      setItems(cvs);
    }
  }, [cvs]);

  useEffect(() => {
    getCvsAction();
  }, []);

  useEffect(() => {
    if (loadCvs) {
      getCvsAction();
    }
  }, [loadCvs]);

  const updateCvs = throttle((newCvs) => {
    updateCvsAction(newCvs);
  }, 500, { trailing: true });

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const cachedOrder = items[oldIndex].order;

    items[oldIndex].order = items[newIndex].order;

    items[newIndex].order = cachedOrder;

    const newCvs = arrayMove(items, oldIndex, newIndex);

    setItems(newCvs);
    updateCvs(newCvs);
  };

  return (
    <Layout title={'CV'} needLogin>
      <SortableList
        useDragHandle
        items={items}
        onSortEnd={onSortEnd}
        renderItem={(cv, index) => (
          <SortableItem key={`cv-item-${index}`} index={index}>
            <div key={cv._id} className='cv__item'>
              <div className='cv__item__buttons'>
                <DraggableHandle />
                <div className='cv__item__buttons__delete' onClick={() => deleteCvAction(cv._id)}>
                  <i className='fa fa-trash' />
                </div>
              </div>
              <div className='cv__item__content'>
                <div>
                  {`${formatDate(cv.publishAt)}`}
                </div>

                <Link to={`/cv/${cv._id}`} className='cv__title'>
                  <h3>{cv.title}</h3>
                </Link>

                <p className='cv__description'>{cv.description}</p>
              </div>
            </div>
          </SortableItem>
        )}
      />

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
            to='/create-cv'>
            Adauga
          </NavLink>
        </button>
      </div>
    </Layout>
  );
};

const mapStateToProps = ({ cvReducer: { cv } }) => ({ cv });

const mapDispatchToProps = {
  deleteCvAction: action.deleteCvAction,
  getCvsAction: action.getCvsAction,
  updateCvsAction: action.updateCvsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cv);
