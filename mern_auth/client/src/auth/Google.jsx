import React from 'react';
import axios from 'axios';
import GoogleLogin from 'react-google-login';

const Google = ({ informParent = f => f }) => {
  const responseGoogle = res => {
    console.log(res.tokenId);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/google-login`,
      data: { idToken: res.tokenId }
    })
      .then(res => {
        console.log('GOOGLE SIGNIN SUCCESS', res);
        // inform parent component
        informParent(res);
      })
      .catch(err => {
        console.log('GOOGLE SIGNIN ERROR', err.response);
      });
  };

  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        render={renderProps => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className=" btn btn-danger btn-lg btn-block"
          >
            <i class="fab fa-google"></i> Login with Google
          </button>
        )}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default Google;
