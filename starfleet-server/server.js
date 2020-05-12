const search = require('./API/searchApi')
const dotenv = require('dotenv').config()

search.listen(process.env.PORT_SEARCH_API || 9001, (err) => {
    if (err) {
        console.log("Error : " + err)
    }
    else {
        console.log("Search API connected @ PORT : " + process.env.PORT_SEARCH_API)
    }
})