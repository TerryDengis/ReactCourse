import React from 'react';
import Layout from './core/Layout';

const App = () => {
  return (
    <Layout>
      <div className="col-d-6 offset-md-3 text-center">
        <h1 className="p-5">React Node MongoDB Authentification Boilerplate</h1>
        <h2>MERN Stack</h2>
        <hr />
        <p className="lead">
          MERN stack login register system with account activation, login with Facebook and Google
          as well as private and protected routes for authenticated users and users with the role of
          admin. As well as forgot password functionality.
        </p>
      </div>
    </Layout>
  );
};

export default App;
