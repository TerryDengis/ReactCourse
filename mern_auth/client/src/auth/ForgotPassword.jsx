import React, { useState } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';

const ForgotPassword = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Submit'
  });

  const { email, buttonText } = values;

  const handleChange = field => event => {
    setValues({ ...values, [field]: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    Axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email }
    })
      .then(res => {
        console.log('FORGOT PASSWORD SUCCESS ', res);
        toast.success(res.data.message);
        setValues({ ...values, buttonText: 'Requested' });
      })
      .catch(err => {
        console.log('FORGOT PASSWORD ERROR', err.response.data);
        setValues({ ...values, buttonText: 'Submit' });
        toast.error(err.response.data.error);
      });
  };

  const forgotPasswordForm = () => (
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
        <h1 className="p-5 text-center">Forgot Password</h1>
        {forgotPasswordForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
