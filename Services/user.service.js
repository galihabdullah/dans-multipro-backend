const bcrypt = require("bcrypt")
const DATABASE = require("./database")
const e = require("express");
const jwt = require("jsonwebtoken");
const DefinedException = require("../Exceptions/DefinedException");
const {TokenExpiredError} = require("jsonwebtoken");
class UserService{
    async Register(params){
        const password = bcrypt.hashSync(params.password, 10);
        return new Promise((resolve, reject) => {
            DATABASE.query("INSERT INTO users (username, password) values (?,?)",[params.username, password], function (error) {
                if (error){
                    const message = error.message
                    if (message.includes("Duplicate entry")){
                        reject(new DefinedException("Username has already taken"))
                    }
                    reject(error)
                }
            })
        })
    }

    async Login(params){
        const user = await new Promise((resolve, reject) => {
            DATABASE.query("SELECT * from users where username = ? limit 1", [params.username], function (error, results){
                if (error){
                    reject(error)
                }
                const result = results.length > 0 ? results[0] : null
                resolve(result)
            })
        }).then(result => {
            return result
        }).catch(err => {
            throw err
        })

        if (!user){
            throw new DefinedException("User not found")
        }


        const isPasswordMatch = await bcrypt.compare(params.password, user.password);
        if (!isPasswordMatch){
            throw new DefinedException("Password not match")
        }


        const accessToken = jwt.sign({
            data : {
                id : user.id,
                username : user.username
            }
        }, process.env.TOKEN_SECRET,{expiresIn: 3600});

        const refreshToken = jwt.sign({
            data : {
                id : user.id,
                username : user.username
            }
        }, process.env.REFRESH_TOKEN_SECRET,{expiresIn: 3600})

        return {
            username : user.username,
            access_token : accessToken,
            refresh_token : refreshToken
        }

    }

    async Refresh(token){
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const {data} = decoded
            const accessToken = jwt.sign({ data : data},
                process.env.TOKEN_SECRET, {expiresIn: 3600});

            const refreshToken = jwt.sign({
                data : data
            }, process.env.REFRESH_TOKEN_SECRET,{expiresIn: 3600})

            return {
                username : data.username,
                access_token : accessToken,
                refresh_token : refreshToken
            }


        } catch(err) {
            if (err instanceof TokenExpiredError){
                throw new DefinedException( "Token Expired")
            }
            throw new DefinedException("Unauthorized")
        }
    }

}

module.exports = UserService
