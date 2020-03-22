import React from 'react';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Facebook = ({ informParent = f => f }) => {
  const responseFacebook = res => {
    console.log(res.tokenId);
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/facebook-login`,
      data: { userID: res.userID, accessToken: res.accessToken }
    })
      .then(res => {
        console.log('FACEBOOK SIGNIN SUCCESS', res);
        // inform parent component
        informParent(res);
      })
      .catch(err => {
        console.log('FACEBOOK SIGNIN ERROR', err.response);
      });
  };

  return (
    <div className="pb-3">
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        autoLoad={false}
        callback={responseFacebook}
        render={renderProps => (
          <button onClick={renderProps.onClick} className=" btn btn-primary btn-lg btn-block">
            <i class="fab fa-facebook pr-2"></i> Login with Facebook
          </button>
        )}
      />
    </div>
  );
};

export default Facebook;
