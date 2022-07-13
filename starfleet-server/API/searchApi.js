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
            return entry
        })
    }).catch(err => {
        console.log("Error : " + err)
    })
}

module.exports = app