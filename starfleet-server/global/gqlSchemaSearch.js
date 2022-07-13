const { buildSchema } = require('graphql')

module.exports = new buildSchema(`

    type SearchQuery{
        searchQuery(shipName: String!) : [StarShip]!
    }

    type StarShip{
        name: String!
        model: String!
        manufacturer: String!
        cost_in_credits: String!
        length: String!
        max_atmosphering_speed: String!
        crew: String!
        passengers: String!
        cargo_capacity: String!
        consumables: String!
        hyperdrive_rating: String!
        MGLT: String!
        starship_class: String!
        image: String!
    }

    schema{
        query: SearchQuery
    }

`)