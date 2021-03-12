const input = document.querySelector('#city-input');
const search = document.querySelector('#search-button');
const clear = document.querySelector('#clear-history');
const cityName = document.querySelector('#city-name');
const picEl = document.querySelector('#current-pic');
const tempEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windEl = document.querySelector('#wind-speed');
const uvEl = document.querySelector('#UV-index');
const history = document.querySelector('#history');
let searchHistory = JSON.parse(localStorage.getItem("search")) ?? [];
// console.log(searchHistory);
const apiKey = 'c4383c3920ad65c7f73d332129d17468';

//get city name with search button clicked
async function getWeather(cityName) {
    try {
        //using the city name, use get request from open weather map api
        let fetchMe = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);
        let response = await fetchMe.json();
        console.log(response);
        //show current conditions using parse
        const todaysDate = new Date(response.dt * 1000);
        console.log(todaysDate);
        const day = todaysDate.getDate();
        const month = todaysDate.getMonth() + 1;
        const year = todaysDate.getFullYear();
        cityName.innerHTML = `${response.name} (${month}/${day}/${year}) `;
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

