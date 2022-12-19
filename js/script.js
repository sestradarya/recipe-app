const mealsEl = document.getElementById('meals')
const favoriteContainer = document.getElementById('fav-meals')
const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')
// const mealPopup = document.getElementById('meal-popup')
// const popupCloseBtn = document.getElementById('close-popup')
// const mealInfoEl = document.getElementById('meal-info')


async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const respData = await resp.json()
    const randomMeal = respData.meals[0]
    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const respData = await response.json()
    return respData.meals[0]
}

async function getMealsBySearch(term) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    const respData = await response.json()
    return respData.meals
}

function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
            <div class="meal-header">
            ${random ? `<span class="random">
                    Random receipe
                </span>`: ''}
                <img src=${mealData.strMealThumb} alt=${mealData.strMeal}>
            </div>
            <div class="meal-body">
                <h4>${mealData.strMeal}</h4>
                <button class="fav-btn" onclick="">
                    <i class="far fa-heart"></i>
                </button>
            </div>
    `;

    const btn = meal.querySelector(".meal-body .fav-btn")

    btn.addEventListener('click', () => {
        if (btn.classList.contains("active")) {
            removeMealFromLS(mealData.idMeal)
            btn.classList.remove("active")
        }
        else {
            addMealToLS(mealData.idMeal);
            btn.classList.add("active");
        }


        fetchFavMeals()

    })

    mealsEl.addEventListener('click', () => {
        // showMealInfo(mealData)

    })

    meals.appendChild(meal);
}


function addMealToLS(mealId) {
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealFromLS(mealId) {
    const mealIds = getMealsFromLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)))
}

function getMealsFromLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    const mealIds = getMealsFromLS();
    favoriteContainer.innerHTML = ``

    const meals = []
    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i]

        meal = await getMealById(mealId);

        addMealToFav(meal)

    }


}

function addMealToFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
            <img src=${mealData.strMealThumb}
                alt=${mealData.strMeal}>
            <span>${mealData.strMeal}</span>
            <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn = favMeal.querySelector('.clear')
    btn.addEventListener('click', () => {
        removeMealFromLS(mealData.idMeal);
        fetchFavMeals();
    })
    favoriteContainer.appendChild(favMeal);
}

searchBtn.addEventListener('click', async () => {
    mealsEl.innerHTML = ``;
    const search = searchTerm.value;

    const meals = await getMealsBySearch(search)
    if (meals) {
        meals.forEach((meal) => { addMeal(meal) })
    }
})

// function showMealInfo(mealData){
//     const mealInfoEl = document.createElement('div');

//     mealInfoEl.appendChild(mealEl)
//     mealEl.innerHTML = `
//         <h1>${mealData.strMeal}</h1>
//         <img src=${mealData.strMealThumb} alt="">

//         <p>${mealData.strInstructions}</p>
//         <ul>
//             <li>ing 1 / measure</li>
//             <li>ing 2 / measure</li>
//             <li>ing 3 / measure</li>
//         </ul>
//     `

//     mealPopup.style.opacity = '1'
// }

// popupCloseBtn.addEventListener('click', () => {
//     mealPopup.style.opacity = '0'
// })


fetchFavMeals()
getRandomMeal()