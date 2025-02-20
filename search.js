window.onload = () => {
    const title = document.querySelector("h2");
    const poblacion = localStorage.getItem("poblacion");

    title.innerHTML = poblacion;
    getInfo(poblacion);
    getImage(poblacion);
}

async function getInfo(poblacion) {
    const info = document.getElementById("info-container");
    const temp = document.getElementById("temperature");
    const weather = document.getElementById("weather");
    const key = "45d001077fd3dfa6b8ee9cc015dd5fc";
    const searchURL = "https://api.openweathermap.org/data/2.5/weather?q="+ poblacion +",ES&appid="+ key +"8&units=metric&lang=es";

    let response = await fetch(searchURL);
    let result = await response.json();

    if (result.cod != 200) {
        const p = document.createElement("p");
        p.innerHTML = "No se ha encontrado datos en esta localidad...";

        info.append(p);
        return;
    }

    insertInfo(result, temp, weather);
}

async function getImage(poblacion) {
    const galery = document.getElementById("image-container");
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=images&titles="+ poblacion +"&gimlimit=1&prop=imageinfo&iiprop=url";

    let response = await fetch(url);
    let result = await response.json();
    
    if (!result.query) return;

    insertImage(result, galery);
}

function getMap(lat, lon) {
    const map = document.querySelector("iframe");
    const mapsAPI = "https://www.google.com/maps?q="+ lat +","+ lon +"&z=6&output=embed";
    
    map.src = mapsAPI;
}

function insertInfo(result, temp, weather) {
    console.log(result)
    const main = document.createElement("p");
    const feels = document.createElement("p");
    const desc = document.createElement("p");

    main.innerHTML = Math.round(result.main["temp"]) +"°C";
    feels.innerHTML = "Sensación: "+ Math.round(result.main["feels_like"]) +"°C";
    insertIcon(result.weather[0]["icon"], weather)
    desc.innerHTML = result.weather[0]["description"];

    main.classList.add("main");

    getMap(result.coord["lat"], result.coord["lon"]);

    temp.append(main);
    temp.append(feels);
    weather.append(desc)
};

function insertImage(result, container) {
    const images = Object.values(result.query.pages);

    images.forEach(element => {
        const img = document.createElement("img");
        img.src = element.imageinfo[0].url;
        img.width = 300;
        img.height = 300;

        container.append(img);
    });
}

function insertIcon(iconCode, container) {
    let img = document.createElement("img");
    img.src = "https://openweathermap.org/img/wn/"+ iconCode +"@2x.png";

    container.append(img);

    let tiempo = parseInt(iconCode);
    console.log(tiempo)

    if (tiempo == 1) mostrarNotificacion("☀️ DIA SOLEADO! ☀️", "No olvides tu protector solar!", iconCode)
    if (tiempo == 2 || tiempo == 3 || tiempo == 4) mostrarNotificacion("☁️ DIA NUBLADO! ☁️", "Esperemos que no llueva!", iconCode)
    if (tiempo == 10 || tiempo == 9) mostrarNotificacion("🌧️ ALERTA DE LLUVIA! 🌧️", "No olvides el paraguas!", iconCode)
    if (tiempo == 11) mostrarNotificacion("⛈ ALERTA DE TORMENTA! ⛈", "Permanece en un lugar seguro!", iconCode)
    if (tiempo == 13) mostrarNotificacion("❄️ ALERTA DE NIEVE! ❄️", "Abrígate bien!", iconCode)
}

function mostrarNotificacion(titulo, mensaje, iconCode) {
    if (Notification.permission == "granted") {
        new Notification(titulo, {
            body: mensaje,
            icon: "https://openweathermap.org/img/wn/"+ iconCode +".png",
        });
    }
}