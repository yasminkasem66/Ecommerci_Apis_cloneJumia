const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {

    token = authHeader.split(' ')[1];

  }


  // check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  console.log(token)

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
  try {
    // console.log("c")
    // console.log(token)
    // const payload = isTokenValid(token);
    let payload;
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.0000000' });
      } else {
        // if everything is good, save to request for use in other routes
        payload = decoded;
      }
    });

    // var decoded = jwt.decode(token);
    // var decoded = jwt.decode(token, { complete: true });

    console.log("payloadpayload", payload )


    // Attach the user and his permissions to the req object
    req.user = {
      userId: payload.userId,
      role: payload.role,
      name: payload.name,
      image: payload.image,
    };

    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication invalid , gggggg ');
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
