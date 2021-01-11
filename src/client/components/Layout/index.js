import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Redirect, withRouter, NavLink, Link } from 'react-router-dom';
import {
  useLastLocation,
  RedirectWithoutLastLocation,
} from 'react-router-last-location';
import Switch from 'react-switch';
import { Collapse } from 'reactstrap';

import PropTypes from 'prop-types';
import * as globalAction from 'store/action';
import './styles.scss';

const Child = ({
  title,
  children,
  className = '',
  showSidebar = true,
  location: { pathname },
  global: { theme, accessToken, user },
  updateThemeAction,
  updateTokenAction,
}) => {
  const onChangeTheme = (checked) => {
    updateThemeAction(checked ? 'dark' : 'light');
  };

  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <>
      <Helmet title={title} />
      <div className='container'>
        <div className='row main__container'>
          {showSidebar && (
            <div className='col-lg-3 col-12 sidebar'>
              <div className='d-lg-none justify-content-end d-flex mb-lg-0 mb-2'>
                <button className='btn btn-primary' onClick={toggleNavbar}>
                  <i className='fas fa-bars'></i>
                </button>
              </div>

              <Collapse isOpen={!collapsed} navbar className='d-lg-block'>
                <div className='sidebar__title__container'>
                  <Link to='/' className='sidebar__title mr-auto'>
                    <h1>Acasa</h1>
                  </Link>

                  <Switch
                    checked={theme === 'dark'}
                    onChange={onChangeTheme}
                    checkedIcon={
                      <div className='switch__icon'>
                        <i className='fa fa-sm fa-sun'></i>
                      </div>
                    }
                    uncheckedIcon={
                      <div className='switch__icon'>
                        <i className='fa fa-sm fa-moon fa-flip-horizontal'></i>
                      </div>
                    }
                    onColor='#fbfbff'
                    offColor='#222725'
                    onHandleColor='#449dd1'
                    offHandleColor='#449dd1'
                    handleDiameter={20}
                  />
                </div>

                <div className='sidebar__section'>
                  <h5>Link-uri utile</h5>

                  {!accessToken && (
                    <>
                      <ul className='nav flex-column'>
                        <li className='nav-item'>
                          <Link className='nav-link sidebar__item' to='/login'>
                            Login
                          </Link>
                        </li>

                      </ul>
                    </>
                  )}

                  {!accessToken && (
                    <>
                      <ul className='nav flex-column'>
                        <li className='nav-item'>
                          <Link className='nav-link sidebar__item' to='/jobs'>
                            Posturi
                          </Link>
                        </li>

                      </ul>
                    </>
                  )}

                  {user && (
                    <>
                      <ul className='nav flex-column'>
                        <li className='nav-item'>
                          <NavLink
                            className='nav-link sidebar__item'
                            to='/profile'>
                            {user?.name}
                          </NavLink>
                        </li>

                        <li className='nav-item'>
                          <Link
                            className='nav-link sidebar__item'
                            to={pathname}
                            onClick={() => {
                              updateTokenAction();
                            }}>
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
                </div>

              </Collapse>
            </div>
          )}

          <div className={`${showSidebar ? 'col-lg-9 col-12' : 'col-12'}`}>
            <div className={className && className}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Layout = (props) => {
  const {
    needLogin,
    returnPath = '/',
    location: { pathname },
    global: { accessToken, refreshToken, user },
    fetchTokenAction,
    renewTokenAction,
    getMeAction,
  } = props;

  const lastLocation = useLastLocation();

  useEffect(() => {
    fetchTokenAction();

    if (refreshToken) {
      renewTokenAction({ refreshToken });
    }

    if (!user) {
      getMeAction();
    }

    // Reset scroll.
    window.scrollTo(0, 0);
  }, []);

  if (needLogin && !accessToken) {
    return <Redirect to='/login' />;
  }

  if (pathname === '/login' && accessToken) {
    return (
      <RedirectWithoutLastLocation to={lastLocation?.pathname || returnPath} />
    );
  }

  return <Child {...props} />;
};

Layout.propTypes = {
  title: PropTypes.string,
  needLogin: PropTypes.bool,
  returnPath: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  showSidebar: PropTypes.bool,
};

const mapStateToProps = ({ global }) => ({ global });

const mapDispatchToProps = {
  fetchTokenAction: globalAction.fetchTokenAction,
  renewTokenAction: globalAction.renewTokenAction,
  getMeAction: globalAction.getMeAction,
  updateThemeAction: globalAction.updateThemeAction,
  updateTokenAction: globalAction.updateTokenAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Layout));
