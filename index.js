const express = require("express")
const DATABASE = require("./Services/database");
const app = express()
const UserController = require("./Controllers/user.controller");
const RecruitmentController = require("./Controllers/recruitment.controller");
const jwt = require("jsonwebtoken");
const {TokenExpiredError} = require("jsonwebtoken");
const {ensureTokenValid} = require("./Middlewares/EnsureIsAuthenticated");

app.use(express.json())

const port = process.env.APP_PORT


app.get("/", function (req, res){
    res.json({
        'status' : 'ok'
    })
})

app.post("/register", UserController.Register)
app.post("/login", UserController.Login)
app.post("/refresh-token", UserController.Refresh)
app.get("/recruitment", ensureTokenValid, RecruitmentController.All)
app.get("/recruitment/:id", ensureTokenValid, RecruitmentController.Detail)



const server = app.listen(port, () => {
    console.log(`Listening http on port :${port}`)
})


process.on('SIGINT', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    DATABASE.end(function (err) {
        console.log(err)
    });

    server.close((err) => {
        console.log(err)
    })
})
