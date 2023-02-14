const parentTable = document.querySelector("table")
//For years options
const yearDropdownMin = document.querySelector("#yearDropdownMin")
const yearDropdownMax = document.querySelector("#yearDropdownMax")

const yearMin = document.querySelector("#yearMin")
const yearMax = document.querySelector("#yearMax")

//For genres options
const genreOptions = document.querySelector("#genreOptions")

//For my genres filter
const chosenGenre = document.querySelector("#chosenGenre")

//For rate options
const rateMin = document.querySelector("#rateMin")
const rateMax = document.querySelector("#rateMax")

const rateMinContent = document.querySelector("#rateMinContent")
const rateMaxContent = document.querySelector("#rateMaxContent")


fetchMovies()
fetchYearOptions()
fetchGenresOptions()
let data
let startLength
writeRateOptions()

//Fetches all movies
async function fetchMovies() {
    try{
    const response = await fetch("/api/movies")
    data           = await response.json()
        startLength = data.length
        writeMovies(data)
    }
    catch(error) {
        console.log(error)
    }
}


//Writes all movies into the tabel
function writeMovies(movies) {
        parentTable.innerHTML = ""
        movies.map(movie => parentTable.innerHTML += `
        <tr>
        <td>${movie.title}</td>
        <td>${movie.releaseDate}</td>
        <td>${movie.age}</td>
        <td>${movie.genres}</td>
        <td>${movie.rating}%</td>
        </tr>
        `).join("");
}

//Fetches all years and writes them for filtering options
async function fetchYearOptions() {
    const response = await fetch("/api/movies/year")
    const dataYear     = await response.json()

    let years = []
    
    dataYear.map(movieYear => !years.includes(JSON.stringify(movieYear).split('"')[3].split("-")[0]) 
    ? years.push(JSON.stringify(movieYear).split('"')[3].split("-")[0]) 
    : "" )
    years.sort()

    years.map(year => yearDropdownMin.innerHTML += `
    <span class="dropdownSpan" onclick="MinYearClicked(${year})" id="Min${year}">${year}</span>
    `)
    
    years.map(year => yearDropdownMax.innerHTML += `
    <span class="dropdownSpan" onclick="MaxYearClicked(${year})" id="Min${year}">${year}</span>
    `)
}

//Write all RateOptions for filtering the movies
function writeRateOptions() {
    let rates = ["0.10", "0.20", "0.30", "0.40", "0.50", "0.60", "0.70", "0.80", "0.90", "1.00"]

    rates.map(rate => rateMinContent.innerHTML += `
    <span class="dropdownSpan" onclick="minRate(${rate})">${rate}</span>
    `)

    rates.map(rate => rateMaxContent.innerHTML += `
    <span class="dropdownSpan" onclick="maxRate(${rate})">${rate}</span>
    `)
}

function minRate(rate) {
    rateMin.innerText = rate
    filterRate()
}

function maxRate(rate) {
    rateMax.innerText = rate
    filterRate()
}

//checks if both rate options been choosen and filters the movies array
function filterRate() {
    if(rateMin.innerText == "Min" || rateMax.innerHTML == "Max"){
    }
    else {
        const removedMinRate = data.filter(movie => movie.rating >= rateMin.innerText)
        const removedMaxRate = removedMinRate.filter(movie => movie.rating <= rateMax.innerText)
        writeMovies(removedMaxRate)
    }
}

function MinYearClicked(year) {
    yearMin.innerText = year
    filterYears()
}                

function MaxYearClicked(year) {
    yearMax.innerText = year
    filterYears()
}

//Checks if both year options been choosen and filters the movies array
function filterYears() {
    if(data.length < startLength) {
        fetchMovies()
    }

    if(yearMin.innerText == "Min" || yearMax.innerText == "Max") {
    }
    else {
        const removedMinYear = data.filter(movie => JSON.stringify(movie.releaseDate).split('"')[1].split("-")[0] >= yearMin.innerText)
        const removedMaxYear = removedMinYear.filter(movie => JSON.stringify(movie.releaseDate).split('"')[1].split("-")[0] <= yearMax.innerText)
        data = removedMaxYear
        writeMovies(removedMaxYear)
    }
}



//Filters years from newest to oldest and other way
const topDown = document.querySelector("#topDown").addEventListener("click", () => {
    NewFirst()
})

const downTop = document.querySelector("#downTop").addEventListener("click", () => {
    OldFirst()
})

function NewFirst() {
    writeMovies(data.sort((a, b) => (a.releaseDate > b.releaseDate) ? -1 : 1))
}

function OldFirst() {
    writeMovies(data.sort((a, b) => (a.releaseDate < b.releaseDate) ? -1 : 1))
}

//Fetch all genres and writes them as options to choose from
async function fetchGenresOptions() {
    const response = await fetch("/api/movies/genres")
    const genresArray = await response.json()

    const allGrenres = []

    genresArray.map(genres => genres.genres.map(genre => !allGrenres.includes(JSON.stringify(genre).split('"')[1])
    ? allGrenres.push(JSON.stringify(genre).split('"')[1])
    : ""))
    allGrenres.sort()
    
    allGrenres.map(genre => genreOptions.innerHTML += `
    <span class="dropdownSpan" onclick="showChosenGenre('${genre}')" id="choise${genre}">${genre}</span>
    `)
}

function showChosenGenre(genre) {
    chosenGenre.innerText = genre
    filterChosenGenre()
}
//Filters the choosen genre to only show them
function filterChosenGenre() {

    const onlyChosenGenre = data.filter(movie => movie.genres.includes(chosenGenre.innerText))
    
    writeMovies(onlyChosenGenre)
    console.log(onlyChosenGenre)
}
