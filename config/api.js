const axios = require('axios')

const callAPI = {

    get: async function (url) {
        const response = await axios.get(url)
        return response.data
    }
}

module.exports = callAPI;