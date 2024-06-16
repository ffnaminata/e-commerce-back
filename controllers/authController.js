const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e1592660566e1d",
    pass: "969c0329c04b0c"
  }
});

//REGISTER
exports.register = async (req, res) => {
  console.log("Received registration data:", req.body);
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).json("Username already exists");
    }

    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
        return res.status(400).json("Email already exists");
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET
      ).toString(),
    });
    const savedUser = await newUser.save();

    const validationToken = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const validationLink = `http://localhost:5000/api/auth/validate-email?token=${validationToken}`;
    await transport.sendMail({
      from: '"Furu Diya" <no-reply@furu-diya.com>',
      to: savedUser.email,
      subject: 'Validate your email',
      html: `<p>Click <a href="${validationLink}">here</a> to validate your email.</p>`
    });

    const { password, ...others } = savedUser._doc;  
    res.status(201).json(others);
  } catch (err) {
    console.error("Error in register:", err);
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
};


//VALIDATE EMAIL
exports.validateEmail = async (req, res) => {

  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await User.findByIdAndUpdate(userId, { isValidated: true });
    res.status(200).json({ message: 'Email successfully validated.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token', details: err });
  }
};

//FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Vérifier si l'utilisateur existe avec l'e-mail fourni
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Générer un token avec une durée de validité courte
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Envoyer un e-mail contenant le lien de réinitialisation avec le token
    const resetLink = `http://localhost:8080/authentification/reset-password?token=${token}`;
    
    // Ici, vous enverrez un e-mail à l'utilisateur avec le lien de réinitialisation
    await transport.sendMail({
      from: '"Furu Diya" <no-reply@furu-diya.com>',
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

    res.status(200).json({ message: "Reset password link sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error sending reset password link", details: err });
  }
}

//RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = CryptoJS.AES.encrypt(req.body.newPassword, process.env.PASS_SECRET);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token", details: err });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
          return res.status(401).json("Wrong User Name");
      }

      if (!user.isValidated) {
          return res.status(401).json("Please validate your email address");
      }

      const hashedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SECRET
      );

      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

      const inputPassword = req.body.password;

      if (originalPassword !== inputPassword) {
          return res.status(401).json("Wrong Password");
      }

      const accessToken = jwt.sign(
          {
              id: user._id,
              isAdmin: user.isAdmin,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
      );

      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken });
  } catch (err) {
      res.status(500).json(err);
  }
};
