const axios = require('axios')

const esUrl = "http://localhost:9200/starfleet_index/_doc"
const swapiUrl = `https://swapi.dev/api/starships?page=${process.argv[2]}`

axios({
    url: swapiUrl,
    method: 'GET',
}).then(res => {
    if (res.status === 200) {
        if (res.data.results) {
            res.data.results.forEach(starship => {
                const {
                    name,
                    model,
                    manufacturer,
                    cost_in_credits,
                    length,
                    max_atmosphering_speed,
                    crew,
                    passengers,
                    cargo_capacity,
                    consumables,
                    hyperdrive_rating,
                    MGLT,
                    starship_class
                } = starship


                axios({
                    url: esUrl,
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: {
                        name,
                        model,
                        manufacturer,
                        cost_in_credits,
                        length,
                        max_atmosphering_speed,
                        crew,
                        passengers,
                        cargo_capacity,
                        consumables,
                        hyperdrive_rating,
                        MGLT,
                        starship_class
                    }
                }).then(res => {
                    if (res) {
                        console.log(res.status)
                    }
                }).catch(err => {
                    console.log("Error : " + err)
                })
            })
        }


    }
}).catch(err => {
    if (err) {
        console.log("Error : " + err)
    }
})