import React, { useState, useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';

const Login = props => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = event => setUser({ ...user, [event.target.name]: event.target.value });

  const onSubmit = event => {
    event.preventDefault();
    if (email === '' || password === '') {
      setAlert('Please enter all fields', 'danger');
    } else {
      console.log(email, password);
    }
  };

  return (
    <div className="form-container">
      <h1>
        Account <span className="text-primary">Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} />
        </div>

        <input type="submit" values="Login" className="btn btn-primary btn-block" />
      </form>
    </div>
  );
};

export default Login;
