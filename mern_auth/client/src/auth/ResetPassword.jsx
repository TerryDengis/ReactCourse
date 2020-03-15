import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../core/Layout';

const ResetPassword = ({ match }) => {
  const [values, setValues] = useState({
    token: '',
    newPassword: '',
    buttonText: 'Submit'
  });

  useEffect(() => {
    const token = match.params.token;

    if (token) {
      setValues({ ...values, token });
    }
    // eslint-disable-next-line
  }, []);

  const { newPassword, token, buttonText } = values;

  const handleChange = event => {
    setValues({ ...values, newPassword: event.target.value });
  };

  const clickSubmit = event => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    console.log('TOKEN ', token);

    Axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/reset-password`,
      data: { newPassword, resetPasswordLink: token }
    })
      .then(res => {
        console.log('RESET PASSWORD SUCCESS ', res);
        toast.success(res.data.message);
        setValues({ ...values, buttonText: 'Requested' });
      })
      .catch(err => {
        console.log('RESET PASSWORD ERROR', err.response.data);
        setValues({ ...values, buttonText: 'Submit' });
        toast.error(err.response.data.error);
      });
  };

  const resetPasswordForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange}
          value={newPassword}
          type="password"
          className="form-control"
          placeholder="Type new password"
          required
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
        <h1 className="p-5 text-center">Reset Password</h1>
        {resetPasswordForm()}
      </div>
    </Layout>
  );
};

export default ResetPassword;
