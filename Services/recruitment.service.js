const axios = require("axios");

class RecruitmentService{
    BASE_URL = process.env.DANS_API

    async all(filter){
        let url = `${this.BASE_URL}/positions.json`
        url = filter.page ? `${url}?page=${filter.page}` : `${url}?page=1`
        url = filter.description ? `${url}&description=${filter.description.toLowerCase()}` : url;
        url = filter.location ? `${url}&location=${filter.location.toLowerCase()}` : url;
        url = filter.full_time ? `${url}&full_time=${filter.full_time}`  : url;
        console.log(url)
        return axios.get(url)
            .then(response => {
                return response.data.filter(item => item)
            })
            .catch(err => {
                throw err
            })
    }


    async findById(id){
        let url = `${this.BASE_URL}/positions/${id}`
        return axios.get(url)
            .then(response => {
                return response.data
            })
            .catch(err => {
                throw err
            })
    }
}


module.exports = RecruitmentService
