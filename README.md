# **STARFLEET - Surf the ships from Star Wars**

### May the force be with you

![STARFLEET](https://i.imgur.com/T7WRiXc.png)

Run the following to generate the tailwind css file
## for v1.6.0+
`npx tailwindcss build -o ./starfleet-ui/src/index.css`
## older than v1.6.0
`npx tailwindcss build ./starfleet-ui/src/tailwind.css -o ./starfleet-ui/src/index.css`

### Dependencies
All the required dependencies are included in the package.json file for both frontend (-ui) and backend (-server). 
`npm install` -- to install it


### ES Data
The sample data which is used for this project is at the root of the repo `es-content.json`. It is not suitable for bulk insertion, so use a node js script to read the json file and insert the data into the ES index

> credits: [https://swapi.dev/](https://swapi.dev/)
