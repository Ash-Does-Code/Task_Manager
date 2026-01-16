
import User from '../models/user.model.mjs';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken.model.mjs';

export const signup=async(req,res)=>{
    const {name,email,password}=req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    try{
      const existing=await User.findOne({ email });
      if(existing){
       return res
        .status(409) // Conflict
        .json({ message: 'User already exists. Try logging in.' });
      }
      // const user = new User({
      // name,email,password });    
      // await user.save()

          const user = await User.create({
      name,
      email,
      password
    });

      res.status(201).send(user)
    }catch(error){
            console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  
  }
    }

export const login=async (req, res) => {
  const { email, password } = req.body;
    try {
      
  // Find user 
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  //  Compare passwords
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
      const payload = {
      userId: user._id,
      email: user.email
    };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: "7d" })

      await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  // Success
  res.json({
    message: "Login successful",
      accessToken,
      refreshToken
  });
    } catch (error) {
                    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  
    }
}

export const logout=async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  await RefreshToken.deleteOne({ token: refreshToken });

  res.json({ message: "Logged out successfully" });
}

export const token=async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    // Check DB
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    //  Verify JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Expired refresh token" });
        }

        const payload = {
          userId: user.userId,
          email: user.email
        };

        const newAccessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

