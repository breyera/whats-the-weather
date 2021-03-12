const input = document.querySelector('#city-input');
const search = document.querySelector('#search-button');
const clear = document.querySelector('#clear-history');
const city = document.querySelector('#city-name');
const picEl = document.querySelector('#current-pic');
const tempEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windEl = document.querySelector('#wind-speed');
const uvEl = document.querySelector('#UV-index');
const history = document.querySelector('#history');
let searchHistory = JSON.parse(localStorage.getItem("search")) ?? [];
// console.log(searchHistory);
const apiKey = 'c4383c3920ad65c7f73d332129d17468';
const row = document.querySelector("#to-row");
const mainC = document.querySelector("#main-card");
const cards = document.querySelector("#cardsss");

//get city name with search button clicked
async function getWeather(cityName) {
    try {
        //using the city name, use get request from open weather map api
        let fetchMe = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        let response = await fetchMe.json();
        console.log(response);
        //show current conditions using parse
        //show month/day/year
        let mainBox = document.querySelector("#main-box");
        mainBox.classList.add("main-box");
        const todaysDate = new Date(response.dt * 1000);
        console.log(todaysDate);
        const day = todaysDate.getDate();
        const month = todaysDate.getMonth() + 1;
        const year = todaysDate.getFullYear();
        city.innerHTML = response.name + " (" + month + "/" + day + "/" + year + ") ";
        //weather icon image
        let weatherIcon = response.weather[0].icon;
        picEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
        picEl.setAttribute("alt",response.weather[0].description);
        tempEl.innerHTML = "Temperature: " + K2F(response.main.temp) + " &#176F";
        humidityEl.innerHTML = "Humidity: " + response.main.humidity + "%";
        windEl.innerHTML = "Wind Speed: " + response.wind.speed + " MPH";
        // get UV index
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let fetchUV = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&cnt=1";
        let queryUVURL = await fetch(fetchUV);
        let uvReponse = await queryUVURL.json();
        console.log(uvReponse);
        let uvIndex = document.createElement('span');
        uvIndex.setAttribute('class', 'badge badge-danger');
        uvIndex.innerHTML = uvReponse[0].value;
        uvEl.innerHTML = "UV Index: ";
        uvEl.append(uvIndex);

        //get 5-day forecast using city name
        let cityFive = response.id;
        let fetchFive = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityFive + "&appid=" + apiKey;
        let queryFive = await fetch(fetchFive);
        let fiveResponse = await queryFive.json();
        console.log(fiveResponse);
        const forecast = document.querySelectorAll(".forecast");

        for (let i = 0; i < forecast.length; i++) {
            forecast[i].innerHTML = "";
            const fIndex = i * 8 + 4;
            const fDate = new Date(fiveResponse.list[fIndex].dt * 1000);
            const fDay = fDate.getDate();
            const fMonth = fDate.getMonth();
            const fYear = fDate.getFullYear();
            const fDateEl = document.createElement("p");
            //show month/day/year
            fDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
            fDateEl.innerHTML = fMonth + "/" + fDay + "/" + fYear;
            forecast[i].append(fDateEl);
            //weather icon image, humidity, temp, and wind
            const fWeatherEl = document.createElement("img");
            fWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + fiveResponse.list[fIndex].weather[0].icon + "@2x.png")
            fWeatherEl.setAttribute("alt", fiveResponse.list[fIndex].weather[0].description);
            forecast[i].append(fWeatherEl);
            const fTempEl = document.createElement("p");
            fTempEl.innerHTML = "Temperature: " + K2F(fiveResponse.list[fIndex].main.temp) + " &#176F";
            forecast[i].append(fTempEl);
            const fHumEl = document.createElement("p");
            fHumEl.innerHTML = "Humidity: " + fiveResponse.list[fIndex].main.humidity + "%";
            forecast[i].append(fHumEl);
            const fWindEl = document.createElement("p");
            fWindEl.innerHTML = "Wind Speed: " + fiveResponse.list[fIndex].wind.speed + " MPH";
            forecast[i].append(fWindEl);
        }

        //catch errors
    } catch (e) {
        console.log(e);
    }
}

function K2F(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

search.addEventListener("click", function() {
    const searchCity = "" + input.value;
    getWeather(searchCity);
    if (searchHistory.includes(searchCity.toLowerCase()) === false) {
        searchHistory.push(searchCity.toLowerCase());
        // console.log(searchHistory.includes(searchCity.toLowerCase()));
        // console.log(searchHistory, searchCity.toLowerCase());
    } 
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderHistory();
});

clear.addEventListener("click", function() {
    searchHistory = [];
    localStorage.removeItem("search")
    renderHistory();
});

function renderHistory() {
    history.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyLi = document.createElement("input");
        historyLi.setAttribute("type", "text");
        historyLi.setAttribute("readonly", true);
        historyLi.setAttribute("class", "form-control d-block bg-white");
        historyLi.setAttribute("value", searchHistory[i]);
        historyLi.addEventListener("click", function(){
            getWeather(historyLi.value);
        });
        history.append(historyLi);
    }
}

