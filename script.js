window.onload = function () {
    const comunidades = document.getElementById("ccaa");
    const provincias = document.getElementById("provincia");
    const poblaciones = document.getElementById("poblacion");
    const submit = document.getElementById("submit");

    loadCombo(comunidades, "ccaa");
    comunidades.addEventListener("change", () => {
        resetCombo(provincias);
        resetCombo(poblaciones);
        loadCombo(provincias, "provincias", comunidades.value);
    });
    provincias.addEventListener("change", () => {
        resetCombo(poblaciones);
        loadCombo(poblaciones, "poblaciones", provincias.value);
    });
    submit.addEventListener("click", (event) => {
        event.preventDefault();
        searchPoblacion(poblaciones, poblaciones.selectedIndex);
    });

    Notification.requestPermission();
};

async function loadCombo(combo, jsonFile, parentCode = 0) {
    const url = "https://raw.githubusercontent.com/frontid/ComunidadesProvinciasPoblaciones/refs/heads/master/"+ jsonFile +".json";
    
    let response = await fetch(url);
    let result = await response.json();
    
    result.forEach(element => {
        if (element.parent_code === String(parentCode)) {
            const option = document.createElement("option");
            option.value = element.code;
            option.innerHTML = element.label;

            combo.append(option);
        }
    });
};

function resetCombo(combo) {
    combo.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.innerHTML = "Selecciona una opción";
    option.selected = true;

    combo.append(option);
}

function searchPoblacion(poblaciones, index){
    let poblacion = poblaciones.options[index].innerHTML;
    localStorage.setItem("poblacion", poblacion)

    window.location.href = "search.html";
}