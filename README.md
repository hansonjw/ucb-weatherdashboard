# weatherdashboard
UCB Coding Bootcamp Assignment #06
Submitted by Justin Hanson


This application is a simple weather dashboard that allows a user to enter a City name then the dashboard will display current weather as well
as a simple five day forecast.  This was an exercise in using 3rd party APIs and manipulating data in the background.

The deployed website is available here:
https://hansonjw.github.io/weatherdashboard/


Some research from the OpenWeather API:
#######################################

Information on the icons...
https://openweathermap.org/weather-conditions



Below is the assigment Criteria for evaluation:
###############################################
# 06 Server-Side APIs: Weather Dashboard

Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities.
The documentation includes a section called "How to start" that will provide basic setup and usage instructions.
Use `localStorage` to store any persistent data.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```
