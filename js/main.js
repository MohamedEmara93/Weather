const currentLocation = document.querySelector('.header-location')
const tempHeader = document.querySelector('.header-temp')
const iconHeader = document.querySelector('.header-icon')
const time = document.querySelector('.time')

let date = new Date()
let weekName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let monthName = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

let searchBar = document.getElementById('search')

let currentDay = document.getElementById('week-day')
let currentMonth = document.getElementById('month')
let currentCity = document.getElementById('city')
let currentTemp = document.getElementById('current-temp')
let currentIcon = document.querySelector('.current-temp-icon')
let currentStatus = document.getElementById('current-status')
let currentHumidity = document.querySelector('.current-humidity')
let currentWind = document.querySelector('.current-wind')
let currentCompass = document.querySelector('.current-compass')

let tomorowWeekDay = document.querySelector('.tomorow-week-day')
let tomorowMonth = document.querySelector('.tomorow-month')
let tomorowIcon = document.querySelector('.tomorow-icon')
let tomorowMaxT = document.querySelector('.tomorow-max')
let tomorowMinT = document.querySelector('.tomorow-min')
let tomorowStatus = document.querySelector('.tomorow-status')

let afterTomorowWeekDay = document.querySelector('.after-tomorow-week-day')
let afterTomorowMonth = document.querySelector('.after-tomorow-month')
let afterTomorowIcon = document.querySelector('.after-tomorow-icon')
let afterTomorowMaxT = document.querySelector('.after-tomorow-max')
let afterTomorowMinT = document.querySelector('.after-tomorow-min')
let afterTomorowStatus = document.querySelector('.after-tomorow-status')

let apiResponse;
let responseData;
let lati;
let longi;

//////////// Get Current Time  ///////////////
setInterval(() => {
    date = new Date()
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    if (hour > 12) { hour = hour - 12 }
    if (hour < 10) { hour = '0' + hour }
    if (min < 10) { min = '0' + min }
    if (sec < 10) { sec = '0' + sec }
    time.innerHTML = hour + ':' + min + ':' + sec
});
///////////////////  Get Current Location  /////////////////
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        lati = position.coords.latitude;
        longi = position.coords.longitude;

        getWeatherData(lati, longi);
    }, function () {
        alert("couldn't get your location!")
        getWeatherData()
    })
}
/////////////  Get Data Of Weather    //////////////
async function getWeatherData(lat = 30.0444, long = 31.2357) {
    apiResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=848e4c9efef048e494f100521210205&q=${lat},${long}&days=3&aqi=no&alerts=no`)
    responseData = await apiResponse.json();
    displayLocationHeader();
    displayCurrentDay();
    displayTomorow();
    displayAfterTomorow();
}

function displayLocationHeader() {
    currentLocation.innerHTML = `${responseData.location.name}, ${responseData.location.region} , ${responseData.location.country}`;
    tempHeader.textContent = `${responseData.current.temp_c}°C`;
    iconHeader.setAttribute('src', `https:${responseData.current.condition.icon}`)
}

function displayCurrentDay() {
    currentDay.innerHTML = weekName[date.getDay()];
    currentMonth.innerHTML = date.getDate() + ' ' + monthName[date.getMonth()];
    currentCity.innerHTML = responseData.location.name;
    currentTemp.innerHTML = Math.floor(responseData.current.temp_c) + '°C';
    currentIcon.setAttribute('src', `https:${responseData.current.condition.icon}`);
    currentStatus.innerHTML = responseData.current.condition.text;
    currentHumidity.innerHTML = responseData.current.humidity + '%'
    currentWind.innerHTML = responseData.current.gust_kph + ' Km/h'
    currentCompass.innerHTML = responseData.current.wind_dir
}

function displayTomorow() {
    let tomorow = responseData.forecast.forecastday[1].date

    tomorowWeekDay.innerHTML = weekName[new Date(tomorow).getDay()]
    tomorowMonth.innerHTML = new Date(tomorow).getDate() + ' ' + monthName[new Date(tomorow).getMonth()]
    tomorowIcon.setAttribute('src', `https:${responseData.forecast.forecastday[1].day.condition.icon}`);
    tomorowMaxT.innerHTML = responseData.forecast.forecastday[1].day.maxtemp_c + '°C';
    tomorowMinT.innerHTML = responseData.forecast.forecastday[1].day.mintemp_c + '°C';
    tomorowStatus.innerHTML = responseData.forecast.forecastday[1].day.condition.text
}

function displayAfterTomorow() {
    let afterTomorow = responseData.forecast.forecastday[2].date

    afterTomorowWeekDay.innerHTML = weekName[new Date(afterTomorow).getDay()]
    afterTomorowMonth.innerHTML = new Date(afterTomorow).getDate() + ' ' + monthName[new Date(afterTomorow).getMonth()]
    afterTomorowIcon.setAttribute('src', `https:${responseData.forecast.forecastday[2].day.condition.icon}`);
    afterTomorowMaxT.innerHTML = responseData.forecast.forecastday[2].day.maxtemp_c + '°C';
    afterTomorowMinT.innerHTML = responseData.forecast.forecastday[2].day.mintemp_c + '°C';
    afterTomorowStatus.innerHTML = responseData.forecast.forecastday[2].day.condition.text
}
///////////////// Search With City Name ////////////////
searchBar.addEventListener('keyup', function () {
    city = searchBar.value
    searchCity(city)
})

async function searchCity(city) {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=848e4c9efef048e494f100521210205&q=${city}&days=3&aqi=no&alerts=no`)
    let data = await response.json()
    console.log(data);
    if (data?.location.name) {
        let { lat } = data.location
        let { lon } = data.location
        getWeatherData(lat, lon)
    } else {
        lati = position.coords.latitude;
        longi = position.coords.longitude;
        getWeatherData(lati, longi)
    }
}
///////////////////// Subscribe //////////////////////////////////
let subscribeInput = document.querySelector('.subscribe-input')
let emailAlert = document.querySelector('.invalid-feedback')
let subscribeBtn = document.querySelector('.sub')
let subLightBox = document.querySelector('.pop-message')

subscribeBtn.addEventListener('click', function () {
    if (subscribeInput.value == '') {
        emailAlert.innerHTML = 'Email Is Required'
        emailAlert.classList.add('d-block')
        emailAlert.classList.remove('d-none')
    } else if (emailValid()) {
        subscribeInput.value = ''
        setTimeout(function () {
            subLightBox.style.transform = 'translate(-50%, 0)'
        }, 1000);
    } else {
        emailAlert.innerHTML = 'Email Is Invalid'
        emailAlert.classList.add('d-block')
        emailAlert.classList.remove('d-none')
    }
})

function x() {
    if (subLightBox.style.transform != 'translate(-50%, -200%)') {
        setInterval(function () {
            subLightBox.style.transform = 'translate(-50%, -200%)'
        }, 3000);
    }
}
subscribeBtn.addEventListener('click', x)

function emailValid() {
    let rejex = /^[\w-\.]+@([\w-]+\.)+[\w-]{3,}$/

    if (rejex.test(subscribeInput.value) == true) {
        subscribeInput.classList.add('is-valid')
        emailAlert.classList.add('d-none')
        emailAlert.classList.remove('d-block')
        return true
    } else {
        subscribeInput.classList.add('is-invalid')
        emailAlert.classList.add('d-block')
        emailAlert.classList.remove('d-none')
        return false
    }
}
subscribeInput.addEventListener('keyup', emailValid)

// Smoove Scroll
$('.smoove').smoove({ offset: '20%' })
// BtnUp
let dataOffset = $('#data').offset().top

$(window).scroll(function () {
    let wScroll = $(window).scrollTop()

    if (wScroll > dataOffset - 100) {
        $('#btnUp').fadeIn(300)
    } else {
        $('#btnUp').fadeOut(300)
    }
})