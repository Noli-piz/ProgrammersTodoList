const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    
    if(!accessToken ){
        return res.json({error : "User not login"});
    }

    try{
        const validToken = verify(accessToken, "importantsecret");
        if(validToken){
            return next();
        }
    }catch (e){
       if(e.message === "invalid token") return res.status(200).json({error: "Access Denied! Invalid Token."});
       else return res.status(200).json({error: e.message});
    }
    
};

module.exports = {validateToken};