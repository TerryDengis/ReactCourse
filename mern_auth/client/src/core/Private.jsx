import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from './Layout';
import { isAuth, getCookie, signout, setLocalStorage } from '../auth/helper';

const Private = ({ history }) => {
  const [values, setValues] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    buttonText: 'Submit'
  });

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = () => {
    Axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      }
    })
      .then(res => {
        const { role, name, email } = res.data;
        setValues({ ...values, role, name, email });
      })
      .catch(err => {
        console.log('PRIVATE PROFILE GET ERROR', err.response.data);

        if (err.response.status === 401) {
          signout(() => {
            history.push('/');
          });
        }
      });
  };

  const { name, role, email, password, buttonText } = values;

  const handleChange = field => event => {
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });

    Axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/user/update`,
      headers: {
        Authorization: `Bearer ${getCookie('token')}`
      },
      data: { name, password }
    })
      .then(res => {
        console.log('PRIVATE PROFILE UPDATE SUCCESS ', res);
        setValues({ ...values, buttonText: 'Submitted' });
        setLocalStorage('user', res.data);
        toast.success('Profile updated succesfully');
      })
      .catch(err => {
        console.log('PRIVATE PROFILE UPDATE ERROR', err.response.data);
        setValues({ ...values, buttonText: 'Submit' });
        toast.error(err.response.data.error);
      });
  };

  const updateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
      </div>
      <div className="form-group">
        <label className="text-muted">Role</label>
        <input defaultValue={role} type="text" className="form-control" disabled />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input defaultValue={email} type="email" className="form-control" disabled />
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
        <h1 className="pt-5 text-center">Private</h1>
        <p className="lead text-center">Profile Update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Private;
