const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  // options for cookie:-

  const expiryDate = new Date(
    Date.now() +
      String(process.env.JWT_EXPIRES_IN).replace(/\D/g, "") *
        24 *
        60 *
        60 *
        1000
  );

  const options = {
    expires: expiryDate,
    httpOnly: true,
  };
  res
    .status(statusCode)
    .cookie("token", token, { ...options })
    .json({
      success: true,
      message,
      user,
      token,
    });
};

module.exports = sendToken;
