const submitCityBtn = document.querySelector(".submitCityBtn");
window.addEventListener("load",() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const apiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid={apiKey}`;
            fetch(apiCall).then(resp => {
                return resp.json();
            })
            .then(handleErrors)
            .then(data => {
                const {name,main:{temp},weather} = data;
                const {description,icon} = weather[0];
                let iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
                getWeatherData(name,temp,description,iconUrl);
                fetchBingHours(lat,lon);
            })
            .catch(error => {
                console.log(error);
            })
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
            const {name,main:{temp},weather,coord:{lat,lon}} = data;
            const {description,icon} = weather[0];
            let iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;
            getWeatherData(name,temp,description,iconUrl);
            fetchBingHours(lat,lon);
        })
        .catch(error => {
            console.log(error);
        })
    cityName.value = "";
})
//FUNctions
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
const fetchBingHours = (lat,lon) => {
    const apiHourCall = `https://dev.virtualearth.net/REST/v1/timezone/${lat},${lon}?key={BINGDEVMAPSapiKey}`;
    fetch(apiHourCall).then(response => {
        return response.json()
    })
    .then((data) => {
        const formatData = new Date(data.resourceSets[0].resources[0].timeZone.convertedTime.localTime);
        getCityHour(formatData);
    });
};
const getCityHour = (formatData) => {
    const dateHolder = document.querySelector(".locationInfo");
    dateHolder.children[0].innerText = formatData.toString().split(" ")[0];
    dateHolder.children[1].innerText = `${formatData.toString().split(" ")[1]} ${formatData.toString().split(" ")[2]}`;
    dateHolder.children[2].innerText = `${formatData.getHours()}:${formatData.getMinutes()}`;
};
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
};