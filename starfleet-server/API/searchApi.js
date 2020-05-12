const express = require('express')
const app = express()
const axios = require('axios')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
app.use(cors())
const dotenv = require('dotenv').config()

const searchSchema = require('../global/gqlSchemaSearch')

app.use("/search", graphqlHTTP({
    schema: searchSchema,
    rootValue: {
        searchQuery: async (args) => {
            const {
                shipName
            } = args;

            let result = await esSearchHandler(shipName)

            return [
                ...result
            ]
        }
    },
    graphiql: true
}))

async function esSearchHandler(shipName) {
    return await axios({
        url: "http://localhost:9200/starfleet_index/_search?terminate_after=5",
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        },
        data: {
            query: {
                "match_phrase_prefix": {
                    "name": `${shipName}`
                }
            }
        }
    }).then(async (res) => {
        const {
            name
        } = res.data.hits.hits

        let esResult = res.data.hits.hits.map(entry => entry._source)

        return await esResult.map(async (entry) => {
            entry.image = await fetchBingImage(entry.name)
            return entry
        })
    }).catch(err => {
        console.log("Error : " + err)
    })
}

async function fetchBingImage(query) {

    // const searchQuery = query + " star wars"

    // return await axios({
    //     "url": `https://starfleet.cognitiveservices.azure.com/bing/v7.0/images/search?q=${encodeURI(searchQuery)}&count=1`,
    //     "method": "GET",
    //     "headers": {
    //         "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY
    //     }
    // }).then(res => {
    //     return res.data.value[0].contentUrl
    // }).catch(err => {
    //     console.log("Error : " + err)
    // })

    return "https://vignette.wikia.nocookie.net/starwars/images/6/60/Xwing-SWB.jpg/revision/latest/scale-to-width-down/2000?cb=20160704070524"
}

module.exports = app