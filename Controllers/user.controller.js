const DefinedException = require("../Exceptions/DefinedException");
const UserService = require("../Services/user.service");
const jwt = require("jsonwebtoken");
const {TokenExpiredError} = require("jsonwebtoken");

class UserController{
    static async Register(req, res){
        try {
            const params = req.body;
            if (!params.username){
                throw new DefinedException("Username is required")
            }

            if (!params.password){
                throw new DefinedException("Password is required")

            }
            await (new UserService()).Register(params)
            res.json({
                success: true,
                message : "Successfully registered"
            })
        } catch (e) {
            if (e instanceof DefinedException){
                res.status(422).json({
                    success: false,
                    message : e.message,
                })
                return
            }
            res.status(422).json({
                success: false,
                message : "Please contact administrator",
                trace : e.message
            })
        }
    }


    static async Login(req, res){
        try {
            const params = req.body;
            if (!params.username){
                throw new DefinedException("Username is required")
            }

            if (!params.password){
                throw new DefinedException("Password is required")
            }
            const result = await (new UserService()).Login(params)
            res.json({
                success: true,
                data : result
            })
        } catch (e) {
            if (e instanceof DefinedException){
                res.status(422).json({
                    success: false,
                    message : e.message,
                })
                return
            }
            res.status(422).json({
                success: false,
                message : "Please contact administrator",
                trace : e.message
            })
        }
    }

    static async Refresh(req, res){
        try {
            let authorization = req.header('authorization')
            if (!authorization){
                throw new DefinedException("Unauthorized")
            }

            const token = authorization.substring(7, authorization.length)
            const result = await (new UserService()).Refresh(token)
            res.json({
                success: true,
                data : result
            })
        } catch (e) {
            if (e instanceof DefinedException){
                res.status(422).json({
                    success: false,
                    message : e.message,
                })
                return
            }
            res.status(422).json({
                success: false,
                message : "Please contact administrator",
                trace : e.message
            })
        }
    }

}

module.exports = UserController
