// DOM elements...
var cityEl = document.querySelector("#city-to-search"); //

var currentEl = document.querySelector("#current-weather");
var fiveDayEl = document.querySelector("#five-day");
var prevCitiesEl = document.querySelector("#prev-cities");  //

// An object to store current queried city info
var currentCityInfo = {};

// An object to store previous queried city info
var previousCityInfo = {};

// main data parsing function for the Weather day
function parseWeatherData(weatherData, dataSource){
    // this function can handle either of the three data sets: current, 5-day, UV
    
    if(dataSource == "current"){
        
        currentCityInfo.cityWeather = weatherData["weather"]["0"]["description"];
        currentCityInfo.cityName = weatherData["name"];
        currentCityInfo.cityTemp = weatherData["main"]["temp"];
        currentCityInfo.cityDate = moment.unix(weatherData["dt"], "MM-DD-YYYY").format("dddd, MMMM Do YYYY");
        currentCityInfo.cityIcon = weatherData["weather"]["0"]["icon"];
        currentCityInfo.cityHumid = weatherData["main"]["humidity"];
        currentCityInfo.cityWind = weatherData["wind"]["speed"];
        currentCityInfo.cityLat = weatherData["coord"]["lat"];
        currentCityInfo.cityLon = weatherData["coord"]["lon"];

        console.log(currentCityInfo);

    }
    else if(dataSource == "fiveDay"){
        // um code...
        console.log(weatherData);

        // create an array of the 5 day forecast data
        var foreCast = [];
        for (i = 1; i <= 5; i++){
            
            var day = {};

            day.cityDate = moment.unix(weatherData["list"][i.toString()]["dt"]).format("dddd, MMMM Do YYYY");
            day.cityIcon = weatherData["list"][i.toString()]["weather"]["0"]["icon"];
            day.cityTemp = weatherData["list"][i.toString()]["main"]["temp"];
            day.cityHumid = weatherData["list"][i.toString()]["main"]["humidity"];

            foreCast.push(day);
            
        }
        // append the 5 day forecast array to the object
        currentCityInfo.foreCast = foreCast;

    } 
    else if(dataSource == "uv"){
        currentCityInfo.cityUvi = weatherData["current"]["uvi"];
    }  
    else{
        return;
    }
}


function getWeatherData(city){
    console.log("Current weather...");

    var apiKey = "f2b4d2c88506a785d23e14d41985d05f";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
        + city + "&units=imperial&appid=" + apiKey;

    console.log(apiUrl);
    
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                parseWeatherData(data, "current");
                // Go get UV data...this call has to be here becuase of the A-Synchronous behaviour    
                getUvData(currentCityInfo.cityLat, currentCityInfo.cityLon);
                
            });
        }
        else {
            console.log("There was a problem with the request to Open Weather")
        }
    });

}


function getUvData(lat, lon){
    // um code...
    console.log("UV data, a lot of work for this...");
    console.log(typeof lat, lat);
    console.log(typeof lon, lon);

    var apiKey = "f2b4d2c88506a785d23e14d41985d05f";
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?"
        + "lat=" + lat.toString()
        + "&lon=" + lon.toString()
        + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;

    console.log(apiUrl);
    
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                parseWeatherData(data, "uv");
                console.log(currentCityInfo);
                
                //
                // This is where you want to put the function call to "displayWeather()"
                //

            });
        }
        else {
            console.log("There was a problem with the request to Open Weather")
        }
    });
}


function getFiveDayData(city){
    console.log("5 day forecast...");

    var apiKey = "f2b4d2c88506a785d23e14d41985d05f";
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
        + city + "&units=imperial&appid=" + apiKey;

    console.log(apiUrl);
    
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                parseWeatherData(data, "fiveDay");
            });
        }
        else {
            console.log("There was a problem with the request to Open Weather")
        }
    });

}


function displayCurrentWeather(){
    // umm code...
    var weatherToPost = document.createElement('div');
    //weatherToPost.textContent = ;

    currentEl.appendChild(weatherToPost);
}

function displayFiveDayForecast(){
    // umm code...
}


var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityEl.value.trim();
    console.log(city);
    getWeatherData(city);
    getFiveDayData(city);

    // need to consider error handling here...
}

// Listen for button push
cityFormEl.addEventListener("submit", formSubmitHandler);

