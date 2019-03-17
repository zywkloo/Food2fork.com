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
			</ul>
      <p>${xhr.responseText}</p>
			`
        }
    }
    xhr.open('GET', `/recipes?ingredient=${ingredientName}`, true)
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
});
