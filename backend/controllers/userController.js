const User = require("../models/userModal");
const catchAysncHandler = require("../midddleware/catchAysncHandler");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

// 1. REGISTER A USER :-

exports.registerUser = catchAysncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is public id",
      url: "this is public url",
    },
  });

  // get Token
  const msg = "Registered successfully...";
  sendToken(user, 202, res, msg);
});

// 2. LOGIN A USER

exports.loginUser = catchAysncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user has both email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password ", 401));
  }
  const msg = "Logged in successfully...";
  sendToken(user, 200, res, msg);
});

// 3. LOGOUT A USER :-

exports.logoutUser = catchAysncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully...",
  });
});

// 4. FORGOT A PASSWORD

exports.forgotPassword = catchAysncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new ErrorHandler("Usern not Found", 404));
  }

  // send resetToken mail:-
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const url = resetPasswordUrl;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery..`,
      url,
    });

    res.status(200).json({
      success: true,
      message: `Email has been sent to ${user.email} successfully....`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(err.message, 500));
  }
});

//5.  RESET A PASSWORD :-

exports.resetPassword = catchAysncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log("tokenss:==>", resetPasswordToken);
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(`Reset Password token in invalid or has been expired.`)
    );
  }

  if (req.body.new_password !== req.body.confirm_password) {
    return next(new ErrorHandler(`password doesn't match`));
  }

  user.password = req.body.new_password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res, `Password has been updated successfully..`);
});

// 6. GET USER DETAIL:-

//
