import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.model.js'

//register
const registerUser = async(req, res) => {
    const {userName, email, password} = req.body;

    try {
        const checkUser = await User.findOne({email})
        if(checkUser) return res.json({success : false, message : "User already exists with same email, Use another email"})

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName, 
            email, 
            password : hashPassword
        })

        await newUser.save()
        res.status(200).json({
            success : 'true',
            message : "Registered Succesfully",
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured",
        })
    }
}


//login
const loginUser = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        
        const checkUser = await User.findOne({email})
        if(!checkUser) {
            return res.json({
                success : false, 
                message : "User doens't exists. Please register first"
            })
        }
        
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if(!checkPasswordMatch) {
            return res.json({
                success : false, 
                message : "Incorrect password"
            })
        }

        const token = jwt.sign({
            id : checkUser._id,
            role : checkUser.role,
            email : checkUser.email,
            userName : checkUser.userName 
        }, 'CLIENT_SECRET_KEY', {expiresIn : '12h'})

        res.cookie('token', token, { httpOnly : true, secure : false});
        res.json({
            success : true,
            message : "Login Successfully",
            user : {
                email : checkUser.email,
                role : checkUser.role,
                id : checkUser._id,
                userName : checkUser.userName
            },
        }) 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Some error occured",
        })
    }
}


//logout
const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success : true,
        message : 'Logged out successfully',
    })
}
 

//auth middleware
const authMiddleware = async(req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({
            success : false,
            message : "Unothorized user"
        })
    }

    try {
        
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()

    } catch (error) {
        res.status(401).json({
            success : false,
            message : "Unothorized user"
        })
    }
}

export { registerUser, loginUser, logoutUser, authMiddleware }