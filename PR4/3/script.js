let map = L.map('map')

let ourCoords = {
    latitude: 48.94310473226559, 
    longitude: 24.733822568979623
}
let watchId = null

let textlatlng = document.getElementById('textlatlng')
let findButton = document.getElementById('findButton')
let SetDestinationButton = document.getElementById('SetDestinationButton')

document.addEventListener('DOMContentLoaded', getMyLocation)
map.setView([49.267, 31.42], 5)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

findButton.addEventListener('click', function() {flyToPosition(false)})
SetDestinationButton.addEventListener('click', function() {flyToPosition(true)})

function flyToPosition(addPoint) {
    let inputText = textlatlng.value.trim()
    if (inputText !== '') {
        let parts = inputText.split(',')

        if (parts.length == 2) {
            let latitude = parts[0].trim()
            let longitude = parts[1].trim()
            if (longitude != ''){
                if (addPoint){
                    L.marker([latitude, longitude]).addTo(map).bindPopup(`Position of the point: ${latitude}, ${longitude}`)
                }
                map.flyTo([latitude, longitude])
            }
            else{
                alert('Ви ввели тільки одну частину координат')
            }
        } else {
            alert('Неправильний формат введених даних. Будь ласка, введіть координати у форматі "latitude, longitude".')
        }}}

function getMyLocation() {
    map.on('click', onMapClick)

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(displayLocation, displayError)
        var watchButton = document.getElementById('watch')
        watchButton.onclick = watchLocation
        var clearWatchButton = document.getElementById('clearWatch')
        clearWatchButton.onclick = clearWatch
    } else{
        alert('Oops, no geolocaton support')
    }
}

function onMapClick(e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`${e.latlng.lat.toFixed(7)}, ${e.latlng.lng.toFixed(7)}`)
        .openOn(map)
}

function watchLocation() {
    watchId = navigator.geolocation.watchPosition(displayLocation, displayError)
}
function clearWatch() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId)
        watchId = null
    }
}

function displayLocation(position) {
    let latitude = position.coords.latitude
    let longitude = position.coords.longitude
    let div = document.getElementById('location')
    div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude}`
    div.innerHTML += ` (with ${position.coords.accuracy} meters accuracy)`
    let km = computeDistance(position.coords, ourCoords)
    let distance = document.getElementById('distance')
    distance.innerHTML = `Your are ${km} km from the College`

    map.setView([latitude, longitude], 16)
    L.marker([latitude, longitude]).addTo(map).bindPopup(`Your position: ${latitude}, ${longitude}`)
    timeUpdated()
}

function addZero(number) {
    if (number < 10) {
        return "0" + number
    } else {
        return number
    }
}

function timeUpdated() {
    let time = new Date()
    let hours = addZero(time.getHours())
    let minutes = addZero(time.getMinutes())
    let seconds = addZero(time.getSeconds())
    let TimeInput = document.getElementById('timeUpdate')
    TimeInput.innerHTML = `The last update of the position was: ${hours}:${minutes}:${seconds}`
}

function displayError(error) {
    const errorTypes = {
        0: "Unknown error",
        1: "Permission denied by user",
        2: "Position is not available",
        3: "Request timed out"
    }
    const errorMessage = errorTypes[error.code]
    if (error.code == 0 || error.code == 2) {
        errorMessage = errorMessage + " " + error.massage
    }
    let div = document.getElementById('location')
    div.innerHTML = errorMessage
}

function computeDistance(startCoords, destCoords) {
    let startLatRads = degreesToRadians(startCoords.latitude)
    let startLongRads = degreesToRadians(startCoords.longitude)
    let destLatRads = degreesToRadians(destCoords.latitude)
    let destLongRads = degreesToRadians(destCoords.longitude)
    let Radius = 6371

    let distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) * Math.cos(destLatRads) *
        Math.cos(startLongRads - destLongRads)) * Radius

    return distance
}

function degreesToRadians(degrees) {
    let radians = (degrees * Math.PI)/180
    return radians
}