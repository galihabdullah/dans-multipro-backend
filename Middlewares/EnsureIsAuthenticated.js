const jwt = require("jsonwebtoken");
const {TokenExpiredError} = require("jsonwebtoken");

const ensureTokenValid = (req, res, next) => {
    let authorization = req.header('authorization')
    if (!authorization){
        res.status(401).json({
            success : false,
            message : "unauthorized"
        })
        return
    }

    const token = authorization.substring(7, authorization.length)
    try {
        jwt.verify(token, process.env.TOKEN_SECRET);
    } catch(err) {
        console.log(err)
        if (err instanceof TokenExpiredError){
            res.status(401).json({
                success : false,
                message : "Token Expired"
            })
            return;
        }
        res.status(401).json({
            success : false,
            message : "Unauthorized"
        })
        return
    }

    next()
}


module.exports = {
    ensureTokenValid
}
