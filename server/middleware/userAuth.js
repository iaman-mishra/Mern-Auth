import jwt from 'jsonwebtoken';

const userAuth = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token) {
        return res.json({success: false, message: "Unauthorized access try to login again"});
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (decodedToken.id) {
            req.body.userId = decodedToken.id; // Attaching user ID to request body
        }else{
            return res.json({success: false, message: "Unauthorized access try to login again"});
        }
        next();
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

export default userAuth;