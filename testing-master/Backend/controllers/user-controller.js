const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BookingRequest = require("../models/BookingRequest");

// Function to check password expiry and provide information about remaining days
const checkPasswordExpiry = (user) => {
  const passwordExpiryDays = 60;
  const currentDate = new Date();
  const lastPasswordChangeDate = user.passwordChangeDate || user.createdAt;

  const daysSinceLastChange = Math.floor(
    (currentDate - lastPasswordChangeDate) / (1000 * 60 * 60 * 24)
  );

  const daysRemaining = passwordExpiryDays - daysSinceLastChange;

  if (daysRemaining <= 3 && daysRemaining > 0) {
    const message = `Your password will expire in ${daysRemaining} days. Please change your password.`;
    return {
      expired: false,
      daysRemaining: daysRemaining,
      message: message,
    };
  }

  return {
    expired: daysSinceLastChange >= passwordExpiryDays,
    daysRemaining: daysRemaining,
    message: null,
  };
};

const registerUser = async (req, res, next) => {
  const { username, password, fullname, email } = req.body;

  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: "Duplicate username" });
    }

    if (!username || !password || !fullname || !email) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;<>,.?~\\-])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must include a combination of Uppercase letters, Lowercase letters, Numbers, Special characters (e.g., !, @, #, $)",
      });
    }

    // Check for password length
    const minLength = 8;
    if (password.length < minLength) {
      return res.status(400).json({
        error: `Password length should be at least ${minLength} characters.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      fullname,
      email,
    });

    // Update password history for the newly registered user
    user.passwordHistory.push(hashedPassword);
    const passwordHistoryDepth = 5;
    user.passwordHistory = user.passwordHistory.slice(-passwordHistoryDepth);

    await user.save();

    res.status(201).json({ status: "success", message: "User created" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ error: "User is not registered" });
    }

    if (!username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // Check if the account is locked
    if (user.accountLocked) {
      const lockoutDurationMillis = Date.now() - user.lastFailedLoginAttempt;
      const lockoutDurationSeconds = lockoutDurationMillis / 1000;

      if (lockoutDurationSeconds >= 120) {
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        await user.save();
      } else {
        const timeRemainingSeconds = 120 - lockoutDurationSeconds;
        const minutes = Math.floor(timeRemainingSeconds / 60);
        const seconds = Math.floor(timeRemainingSeconds % 60);

        return res.status(400).json({
          error: `Account is locked. Please try again later after ${minutes} minutes and ${seconds} seconds.`,
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts and update last failed login timestamp
      user.failedLoginAttempts += 1;
      user.lastFailedLoginAttempt = Date.now();

      // Check if the maximum allowed failed attempts is reached
      if (user.failedLoginAttempts >= 4) {
        // Lock the account
        user.accountLocked = true;
        await user.save();
        return res
          .status(400)
          .json({ error: "Account is locked. Please try again later." });
      }

      // Save the updated user data
      await user.save();

      return res.status(400).json({ error: "Password does not match" });
    }

    // Reset failed login attempts and last failed login timestamp on successful login
    user.failedLoginAttempts = 0;
    user.lastFailedLoginAttempt = null;
    await user.save();

    // Check if the account is still locked after successful login
    if (user.accountLocked) {
      return res
        .status(400)
        .json({ error: "Account is locked. Please try again later." });
    }

    const payload = {
      id: user._id,
      username: user.username,
      fullname: user.fullname,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ status: "success", token: token });
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      data: [user],
    });
  } catch (error) {
    next(error);
  }
};

const getUserInfoById = async (req, res, next) => {
  const userId = req.params.user_id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    // Check if the new password is different from the current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: "New password must be different from the current password",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;

    // Save the updated user
    await user.save();

    res.status(204).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const userId = req.user.id;
  const { username, fullname, email, bio, phoneNumber } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the fields only if they are different from the existing values
    if (username && username !== "" && username !== user.username) {
      const existingUserWithUsername = await User.findOne({
        username: username,
      });
      if (existingUserWithUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      user.username = username;
    }
    if (fullname && fullname !== "" && fullname !== user.fullname) {
      user.fullname = fullname;
    }
    if (email && email !== "" && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ email: email });
      if (existingUserWithEmail) {
        return res.status(400).json({ error: "Email is already taken" });
      }
      user.email = email;
    }
    if (bio !== undefined && bio !== user.bio) {
      user.bio = bio;
    }
    if (phoneNumber !== undefined && phoneNumber !== user.phoneNumber) {
      const existingUserWithPhoneNumber = await User.findOne({
        phoneNumber: phoneNumber,
      });
      if (existingUserWithPhoneNumber) {
        return res.status(400).json({ error: "Phone number is already taken" });
      }
      user.phoneNumber = phoneNumber;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.json({
      data: [updatedUser],
    });
  } catch (error) {
    next(error);
  }
};

// Get all exchange requests for a user
const getAllExchangeRequests = async (req, res, next) => {
  try {
    const userId = req.params.user_id;

    const exchangeRequests = await BookingRequest.find({
      requester: userId,
    });

    res.json(exchangeRequests);
  } catch (error) {}
};

const uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  // Update the user's profile picture in the database
  const userId = req.user.id;
  const image = req.file.filename;

  User.findByIdAndUpdate(userId, { image })
    .then(() => {
      res.status(200).json({
        success: true,
        data: image,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to update the user's profile picture",
      });
    });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUserInfoById,
  updateUserProfile,
  updatePassword,
  getAllExchangeRequests,
  uploadImage,
};
