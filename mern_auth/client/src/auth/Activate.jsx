import React, { useState, useEffect } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import jwt from 'jsonwebtoken';

import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';

const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    show: true
  });

  useEffect(() => {
    const token = match.params.token;
    const { name } = jwt.decode(token);
    if (token) {
      setValues({ ...values, name, token });
    } else {
      console.log('no token');
    }
    // eslint-disable-next-line
  }, []);

  const { name, token } = values;

  const clickSubmit = event => {
    //event.preventDefault();
    console.log('Token = ', token);
    Axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token }
    })
      .then(res => {
        console.log('ACTIVATE SUCCESS ', res);
        setValues({ ...values, show: false });
        toast.success(`Welcome ${name}!`);
      })
      .catch(err => {
        console.log('ACCOUNT ACTIVATION ERROR', err.response.data.error);
        toast.error(err.response.data.error);
      });
  };

  const activationLink = () => (
    <div className="text-center">
      <h1 className="p-5">Welcome {name}, are you ready to activate your account?</h1>
      <button className="btn btn-outline-primary" onClick={clickSubmit}>
        Activate Account
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="col-d-6 offset-md-3">
        <ToastContainer />
        {activationLink()}
      </div>
    </Layout>
  );
};

export default Activate;
