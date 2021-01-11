import Login from 'pages/Login';
import Register from 'pages/Register';
import Post from 'pages/Post';
import Job from 'pages/Job';
import Home from 'pages/Home';
import { getPostsAction } from 'pages/Post/action';
import { getJobsAction } from 'pages/Job/action';
import PostDetail from 'pages/Post/PostDetail';
import {
  getPostDetailAction,
  getCommentsAction,
} from 'pages/Post/PostDetail/action';
import {
  getCvsForJobAction, getJobDetailAction,
} from 'pages/Job/JobDetail/action';
import CreatePost from 'pages/Post/CreatePost';
import CreateJob from 'pages/Job/CreateJob';
import JobDetail from 'pages/Job/JobDetail';
import Introduce from 'pages/Introduce';
import Projects from 'pages/Introduce/Projects';
import Contact from 'pages/Contact';
import NotFound from 'pages/NotFound';
import App from './client/app';

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home,
        title: 'Home'
      },
      {
        path: '/jobs',
        exact: true,
        component: Job,
        title: 'Job',
        loadData: ({ _params }) => [getJobsAction()],
      },
      {
        path: '/job/:_id',
        component: JobDetail,
        loadData: ({ params: { _id } }) => [
          getJobDetailAction(_id),
          getCvsForJobAction(_id)
        ],
      },
      {
        path: '/create-job',
        component: CreateJob,
        title: 'Create job',
      },
      {
        path: '/posts',
        exact: true,
        component: Post,
        title: 'Post',
        loadData: ({ _params }) => [getPostsAction()],
      },
      {
        path: '/p/:_id',
        component: PostDetail,
        loadData: ({ params: { _id } }) => [
          getPostDetailAction(_id),
          getCommentsAction(_id),
        ],
      },
      {
        path: '/create-post',
        component: CreatePost,
        title: 'Create post',
      },
      {
        path: '/login',
        component: Login,
        title: 'Login',
      },
      {
        path: '/register',
        component: Register,
        title: 'Register',
      },
      {
        path: '/introduce/projects',
        component: Projects,
        title: 'Projects',
      },
      {
        path: '/introduce',
        component: Introduce,
        title: 'Introduce',
      },
      {
        path: '/contact',
        component: Contact,
        title: 'Contact',
      },
      {
        component: NotFound,
        title: 'Error',
      },
    ],
  },
];
