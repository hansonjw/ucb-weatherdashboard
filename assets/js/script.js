// DOM elements...
var cityEl = document.querySelector("#city-to-search"); //
var cityFormEl = document.querySelector("form");
var currentEl = document.querySelector("#current-weather");
var fiveDayEl = document.querySelector("#five-day");
var prevCitiesEl = document.querySelector("#prev-cities");  //

// An object to store current queried city info
var currentCityInfo = {};

// An object to store previous queried city info
var previousCityInfo = [];


// parse generate URL for icon
function generateIcon(iconCode){
    return "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
}


// main data parsing function for the Weather day
function parseWeatherData(weatherData, dataSource){
    // this function can handle either of the three data sets: current, 5-day, UV
    
    if(dataSource == "current"){
        
        currentCityInfo.cityName = weatherData["name"];
        currentCityInfo.cityDate = moment.unix(weatherData["dt"], "MM-DD-YYYY").format("dddd, MM/DD/YYYY");

        currentCityInfo.cityLat = weatherData["coord"]["lat"];
        currentCityInfo.cityLon = weatherData["coord"]["lon"];

        currentCityInfo.cityWeather = weatherData["weather"]["0"]["description"];
        currentCityInfo.cityTemp = weatherData["main"]["temp"];    
        currentCityInfo.cityHumid = weatherData["main"]["humidity"];
        currentCityInfo.cityWind = weatherData["wind"]["speed"];

        currentCityInfo.cityIcon = weatherData["weather"]["0"]["icon"];

    }
    else if(dataSource == "fiveDay"){

        // create an array of the 5 day forecast data
        var foreCast = [];
        for (i = 0; i < 40; i=i+8){
            
            var day = {};
            day.cityDate = moment.unix(weatherData["list"][i.toString()]["dt"]).format("dddd, MM/DD/YYYY");
            day.cityIcon = weatherData["list"][i.toString()]["weather"]["0"]["icon"];
            day.cityTemp = weatherData["list"][i.toString()]["main"]["temp"];
            day.cityHumid = weatherData["list"][i.toString()]["main"]["humidity"];

            foreCast.push(day);
        }
        // append the 5 day forecast array to the object
        currentCityInfo.foreCast = foreCast;
        displayFiveDayForecast(currentCityInfo.foreCast);

    } 
    else if(dataSource == "uv"){
        currentCityInfo.cityUvi = weatherData["current"]["uvi"];
    }  
    else{
        return;
    }
}


function getWeatherData(city){

    var apiKey = "f2b4d2c88506a785d23e14d41985d05f";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="
        + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                parseWeatherData(data, "current");
                // ************** Not sure this is a good code design...
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

    var apiKey = "f2b4d2c88506a785d23e14d41985d05f";
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?"
        + "lat=" + lat.toString()
        + "&lon=" + lon.toString()
        + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
    
    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                parseWeatherData(data, "uv");
                
                //
                // This is where you want to put the function call to "displayWeather()"
                displayCurrentWeather(currentCityInfo);
                //

            });
        }
        else {
            console.log("There was a problem with the request to Open Weather")
        }
    });
}


function getFiveDayData(city){

    var apiKey = "f2b4d2c88506a785d23e14d41985d05f";
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="
        + city + "&units=imperial&appid=" + apiKey;
    
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


function displayFiveDayForecast(forecastArr){
    //receive an array of "days" that represent objects containing weather info..

    var fiveDayTitle = document.createElement("h2");
    fiveDayTitle.textContent = "Five Day Forecast";
    document.querySelector("#five-day-title").appendChild(fiveDayTitle);

    for (i=0; i < forecastArr.length; i++){

        var dayForecast = document.createElement("div");
        dayForecast.setAttribute("class", "card mb-4 shadow-sm");
        fiveDayEl.appendChild(dayForecast);
        
        var dayDate = document.createElement("div");
        dayDate.setAttribute("class", "card-header");
        dayDate.textContent = forecastArr[i].cityDate;
        dayForecast.appendChild(dayDate);

        var dayIcon = document.createElement("img");
        dayIcon.setAttribute("src", generateIcon(forecastArr[i].cityIcon));
        dayForecast.appendChild(dayIcon);

        var dayWeather = document.createElement("div");
        dayWeather.setAttribute("class", "card-body");
        dayForecast.appendChild(dayWeather);

        var dayList = document.createElement("ul");
        dayWeather.appendChild(dayList);

        var listTemp = document.createElement("p");
        listTemp.textContent = "Temperature: " + forecastArr[i].cityTemp;
        dayList.appendChild(listTemp);

        var listHumid = document.createElement("p");
        listHumid.textContent = "Humidity: " + forecastArr[i].cityHumid;
        dayList.appendChild(listHumid);

    }

}


function displayCurrentWeather(aCity){
    // This is total brute force and I would look for another way to do this if I had time...
    // New solution would involve restructing the OBJECT that all of the data is stored in
    // and utilizing loops


    var cardName = document.createElement("h2");
    cardName.textContent = aCity.cityName;
    document.querySelector("#current-city").appendChild(cardName);

    var cardCurrent = document.createElement("div");
    cardCurrent.setAttribute("class", "card mb-4 shadow-sm");

    var cardDate = document.createElement("div");
    cardDate.setAttribute("class", "card-header");
    cardDate.textContent = aCity.cityDate;

    var cardIcon = document.createElement("img");
    cardIcon.setAttribute("src", generateIcon(aCity.cityIcon));

    var cardWeather = document.createElement("div");
    var cardList = document.createElement("ul");
    cardWeather.appendChild(cardList);

    // Adding Weather list items...I know this is bad code...
    var listWeather = document.createElement("p");
    listWeather.textContent = "Current Weather: " + aCity.cityWeather;
    cardList.appendChild(listWeather);

    var listTemp = document.createElement("p");
    listTemp.textContent = "Temperature: " + aCity.cityTemp;
    cardList.appendChild(listTemp);

    var listHumid = document.createElement("p");
    listHumid.textContent = "Humidity: " + aCity.cityHumid;
    cardList.appendChild(listHumid);
    
    var listWind = document.createElement("p");
    listWind.textContent = "Wind Speed: " + aCity.cityWind;
    cardList.appendChild(listWind);

    cardWeather.appendChild(cardList);
    cardCurrent.appendChild(cardName);
    cardCurrent.appendChild(cardDate);
    cardCurrent.appendChild(cardIcon);
    cardCurrent.appendChild(cardWeather);
    currentEl.appendChild(cardCurrent);
    
}


function displayPastCities(){

    // Clear current display on site
    jQuery(prevCitiesEl).empty();
    
    // Display current list of past searches, as buttons
    for(i=0; i < previousCityInfo.length; i++){
        var cityButton = document.createElement("button");
        cityButton.setAttribute("class", "prev-city");
        cityButton.setAttribute("type", "submit");
        cityButton.value = previousCityInfo[i];
        cityButton.textContent = previousCityInfo[i];
        cityButton.setAttribute("id", previousCityInfo[i]);
        prevCitiesEl.appendChild(cityButton);
    }

}


function updateCityInfo() {

    // stores current city
    // clears existing display
    // executes function to update sidebar display
    // update local storage by storing previousCityInfo

    debugger;
    jQuery(currentEl).empty();
    jQuery(fiveDayEl).empty();
    jQuery("#five-day-title").empty()

    var fromStorage = JSON.parse(localStorage.getItem("previousCityInfo"));
    console.log(fromStorage);
    if (fromStorage){
        previousCityInfo = fromStorage;
    }

    if (Object.keys(currentCityInfo).length > 0){
        
        if (previousCityInfo.includes(currentCityInfo.cityName)==false){
            previousCityInfo.push(currentCityInfo.cityName);
        }
        
        localStorage.setItem("previousCityInfo", JSON.stringify(previousCityInfo));
        currentCityInfo = {};
        
        return;
    }

}

var formSubmitHandler = function(event) {

    event.preventDefault();
    // console.log(event.target.id);

    // capture current city
    var city = cityEl.value.trim();
    console.log(city);
    cityEl.value = "";
    
    // Got get weather data
    getWeatherData(city);
    getFiveDayData(city);

    // reset and clear the display, store some data
    updateCityInfo();
    displayPastCities();

}

// Listen for button push
cityFormEl.addEventListener("submit", formSubmitHandler);

// Listen for other city buttons...
jQuery(prevCitiesEl).on("click", "button", function(){
    
    var city = jQuery(this).attr("id");

    // Go get weather data
    getWeatherData(city);
    getFiveDayData(city);
    
    jQuery(currentEl).empty();
    jQuery(fiveDayEl).empty();
    jQuery("#five-day-title").empty()

});

