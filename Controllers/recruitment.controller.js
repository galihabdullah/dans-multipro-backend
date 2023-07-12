const RecruitmentService = require("../Services/recruitment.service");

class RecruitmentController{
    static async All(req, res){
        try {
            const query = req.query
            const recruitments = await (new RecruitmentService).all(query)
            res.json({
                success: true,
                data : recruitments
            })
            res.end()
        }catch (e){
            console.log(e)
            res.status(422).json({
                success: false,
                message : "Please contact administrator",
            })
            res.end()
        }
    }

    static async Detail(req, res){
        try {
            const id = req.params.id
            const recruitments = await (new RecruitmentService).findById(id)
            res.json({
                success: true,
                data : recruitments
            })
            res.end()
        }catch (e){
            console.log(e)
            res.status(422).json({
                success: false,
                message : "Please contact administrator",
            })
            res.end()
        }
    }
}

module.exports = RecruitmentController
