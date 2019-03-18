function getRecipes() {

    let ingredientName = document.getElementById('ingredient').value
    if(ingredientName === '') {
        return alert('Please enter an ingredient')
    }

    let ingredientDiv = document.getElementById('recipesIngredient')
    ingredientDiv.innerHTML = ''

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
 			ingredientDiv.innerHTML = ingredientDiv.innerHTML + `
			<h1> containing ${ingredientName} </h1>
			<ul>
			<li>count: ${response.count}</li>
			</ul> `

            let recipes = response.recipes
            for (let recipe of recipes) {
                ingredientDiv.innerHTML = ingredientDiv.innerHTML + `
                <div class="recipe">
                <a href="${recipe.f2f_url}" target="_blank">
                <img src=${recipe.image_url} />
                <h2>${recipe.title}</h2>
                </a>
                </div>`
                // add sth  here
            }
        }
    }
    xhr.open('GET', `/api?ingredient=${ingredientName}`, true)
    xhr.send()
}

//Attach Enter-key Handler
const ENTER=13
document.getElementById("ingredient")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === ENTER) {
        document.getElementById("submit").click();
    }
})


