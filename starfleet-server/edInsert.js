const fs = require('fs')
const axios = require('axios')

const esUrl = "http://localhost:9200/starfleet_index/_doc"

fs.readFile('es_data.json', (err, data) => {
    console.log(data)
    if (data) {
        let esString = data.toString()
        let parsedString = JSON.parse(esString)

        parsedString.forEach((item) => {
            if (item) {
                axios({
                    url: esUrl,
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: {
                        ...item
                    }
                }).then(res => {
                    console.log(res.status)
                }).catch(err => {
                    console.log(err)
                })
            }
        })
    }
})