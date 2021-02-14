const submitCityBtn = document.querySelector(".submitCityBtn");
window.addEventListener("load",() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const apiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid={apiKey}`;
            fetch(apiCall).then(resp => {
                return resp.json();
            }).then(data => {
                const {name,main:{temp},weather} = data;
                const {description,icon} = weather[0];
                let iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
                getWeatherData(name,temp,description,iconUrl);
            });
        });
    }
});
submitCityBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cityName = document.querySelector(".getCityName");
    const apiCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value}&appid={apiKey}`;
    fetch(apiCall)
        .then(handleErrors)
        .then(response => {
            return response.json();
        })
        .then(data => {
            const {name,main:{temp},weather} = data;
            const {description,icon} = weather[0];
            let iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
            getWeatherData(name,temp,description,iconUrl);
        })
        .catch(error => {
            console.log(error);
        })
    cityName.value = "";
})
//FUNction
const getWeatherData = (name,temp,description,iconUrl) => {
    const cityName = document.querySelector(".locationTimeZone");
    const tempBox = document.querySelector(".tempDegreeToday");
    const weatherInfo = document.querySelector(".weatherInfo");
    const weatherIcon = document.querySelector(".locationIcon");
    cityName.innerText = name;
    tempBox.innerText = `${Math.floor(temp - 273.15)}°`;
    weatherInfo.innerText = description;
    weatherIcon.src = iconUrl;
};
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};