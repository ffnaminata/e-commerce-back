const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const mailer = require("./mailerController")

//REGISTER
exports.register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    // const validationToken = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    // const validationLink = `http://localhost:5000/api/auth/validate-email?token=${validationToken}`;
    // await mailer.sendEmail({
    //   from: 'no-reply@furu-diya.com',
    //   to: savedUser.email,
    //   subject: 'Validate your email',
    //   html: `<p>Click <a href="${validationLink}">here</a> to validate your email.</p>`
    // });
    const { password, ...others } = savedUser._doc;  
    res.status(201).json({...others,  });
  } catch (err) {
    res.status(500).json(err);
  }
};


//VALIDATE EMAIL
exports.validateEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await User.findByIdAndUpdate(userId, { isValidated: true });
    res.status(200).json({ message: 'Email successfully validated.' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token', details: err });
  }
};

//LOGIN
exports.login = async (req, res) => {
    try{
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );

        !user && res.status(401).json("Wrong User Name");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SECRET
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        originalPassword != inputPassword && 
            res.status(401).json("Wrong Password");

        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
  
        const { password, ...others } = user._doc;  
        res.status(200).json({...others, accessToken});

    }catch(err){
        res.status(500).json(err);
    }

};
