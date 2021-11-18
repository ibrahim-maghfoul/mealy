const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_meal = document.getElementById("single-meal");
console.log(search);

/*Function */

// search for meals

function searchMeal(e) {
  e.preventDefault();

  // Clear single Meal
  single_meal.innerHTML = "";

  // Get search term
  const term = search.value;
  // check for empty string
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        resultHeading.innerHTML = `<h2>Serach results for '${term}'</h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
                <img src="${meal.strMealThumb}"></img>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>`
            )
            .join("");
        }
      });
  } else {
    alert("Please Enter a Term");
  }
}

// Fetch meal by id

function getMealById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  console.log(meal.strInstructions);
  single_meal.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}">
    <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
        ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
        </ul>
    </div>
  </div>
  `;
}

// fetch random meal

function randomMeal() {
  // clear meals

  meals.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      console.log("data");
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
/* Event Listners */

submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealById(mealID);
  }
});
