const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  // expiresIn: process.env.JWT_LIFETIME
  const token = jwt.sign(payload, process.env.JWT_SECRET,{ expiresIn: '1d' } );
  return token;
};

// const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);
let isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
  if (err) {
    return res.json({ success: false, message: 'Failed to authenticate token.0000000' });
  } else {
    // if everything is good, save to request for use in other routes
   return decoded;
  }
});

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });

  const oneDay = 1000 * 60 * 60 * 24;

  // return token
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });

  return token;
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
