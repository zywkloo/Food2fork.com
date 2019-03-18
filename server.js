/*
(c) 2019 Louis. D. Nel

WARNING:
NOTE: THIS CODE WILL NOT RUN UNTIL YOU ENTER YOUR OWN openweathermap.org APP ID KEY

NOTE: You need to intall the npm modules by executing >npm install
before running this server

Simple express server re-serving data from openweathermap.org
To test:
http://localhost:3000
or
http://localhost:3000/weather?city=Ottawa
to just set JSON response. (Note it is helpful to add a JSON formatter extension, like JSON Formatter, to your Chrome browser for viewing just JSON data.)
*/


const express = require('express') //express framework
const http_request = require('request') //helpful npm module for easy http requests
const PORT = process.env.PORT || 3000 //allow environment variable to possible set PORT
var indexURL = ['/', '', '/index.html','/recipes.html'];

//const MOCK = require('./const.js')
/*YOU NEED AN APP ID KEY TO RUN THIS CODE
  GET ONE BY SIGNING UP AT openweathermap.org
*/
let API_KEY = 'e6aaaf6e6d45c580a1a1fb68d8f507cb' //<== YOUR API KEY HERE


const app = express()


function  send_instant_index_page(request, response,ingredient,data){
  let html_first = ` <!DOCTYPE html>
  <html lang="en">
      <head>
      <title></title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="styles/styles.css">
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      <script src="js/script.js"></script>
      </head>
      <body>
      <div class="container">
      <div class="wrapper">
      Enter Ingredient Name: <input type="text" name="ingredient" id="ingredient" />
      <button id="submit" onclick="getRecipes()" style="margin-bottom: 50px;">Submit</button>
      </div>
      <div id="recipesIngredient"> `

  let html_bottom = ` </div>
    </div>
</body>
</html> `
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(html_first);
  //response.write(data);
  response.write(parse_data_to_html(ingredient,data));
  response.write(html_bottom);
  response.end();
}

function parse_data_to_html(ingredient,data){
  let html= ''
  let response = JSON.parse(data)
  html = html + `
			<h1> containing ${ingredient} </h1>
			<ul>
			<li>count: ${response.count}</li>
			</ul> `
  let recipes = response.recipes
  for (let recipe of recipes) {
    html = html + `
                <div class="recipe">
                <a href="${recipe.f2f_url}" target="_blank">
                <img src=${recipe.image_url} />
                <h2>${recipe.title}</h2>
                </a>
                </div>`
    // add sth  here
  }
  return html
}

//Middleware
app.use(express.static(__dirname + '/public')) //static server

//Routes
app.get(indexURL, (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/recipes', (request, response) => {
  let url = ''
  let ingredient = request.query.ingredient
  if(!ingredient) {
    response.sendFile(__dirname + '/views/index.html')
  }
  else {
    url = `https://food2fork.com/api/search?key=${API_KEY}&q=${ingredient}`
    http_request.get(url, (err, res, data) => {
      send_instant_index_page(request, response, ingredient, data);
    })
  }
})

app.get('/api', (request, response) => {
  let ingredient = request.query.ingredient
  let url = ''
  if(!ingredient) {
    return response.json({message: 'Please enter a proper ingredient name'})
    url = `https://food2fork.com/api/search?key=${API_KEY}`
  } else {
    url = `https://food2fork.com/api/search?key=${API_KEY}&q=${ingredient}`
  }
  http_request.get(url, (err, res, data) => {
    return response.contentType('application/json').json(JSON.parse(data))
  })
})
//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    //console.log(`http://localhost:3000/recipes?ingredient=Basil`)
    console.log(`To Test:`)
    console.log(`http://localhost:3000/recipes`)
    console.log(`http://localhost:3000/recipes.html`)
    console.log(`http://localhost:3000/index.html`)
    console.log(`http://localhost:3000/recipes?ingredient=Basil`)
    console.log(`http://localhost:3000/recipes?ingredient=Basil,Cumin`)
    console.log(`To get just the JSON data:`)
    console.log(`http://localhost:3000/api`)
    console.log(`http://localhost:3000/api?ingredient=Basil`)
    console.log(`http://localhost:3000/api?ingredient=Basil,Cumin`)
  }
})
