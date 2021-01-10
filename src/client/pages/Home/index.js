import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Layout from 'components/Layout';

// import image from 'assets/image.png';
import * as action from './action';
import './styles.scss';

const Home = ({
  route: { title }
}) => {

  return (
    <Layout title={title}>
    </Layout>
  );
};

const mapStateToProps = ({ postReducer: { post } }) => ({ post });

const mapDispatchToProps = {
  getPostsAction: action.getPostsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
