import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';
import { authenticate, isAuth } from './helper';
import Google from './Google';

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    buttonText: 'Submit'
  });

  const { email, password, buttonText } = values;

  const handleChange = field => event => {
    setValues({ ...values, [field]: event.target.value });
  };

  const informParent = res => {
    authenticate(res, () => {
      isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private');
    });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password }
    })
      .then(res => {
        console.log('SIGIN SUCCESS ', res);
        authenticate(res, () => {
          setValues({ ...values, email: '', password: '', buttonText: 'Submitted' });
          //toast.success(`Welcome ${res.data.user.name}`);
          isAuth() && isAuth().role === 'admin' ? history.push('/admin') : history.push('/private');
        });
      })
      .catch(err => {
        console.log('SIGNIN ERROR', err.response.data);
        setValues({ ...values, buttonText: 'Submit' });
        toast.error(err.response.data.error);
      });
  };

  const signinForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange('email')}
          value={email}
          type="email"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange('password')}
          value={password}
          type="password"
          className="form-control"
        />
      </div>
      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        <h1 className="p-5 text-center">Signin</h1>
        <Google informParent={informParent} />
        {signinForm()}
        <br />
        <Link to="/forgot-password" className="btn btn-sm btn-outline-danger">
          Forgot Password
        </Link>
      </div>
    </Layout>
  );
};

export default Signin;
