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
        searchImages(poblaciones, poblaciones.selectedIndex);
    });
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

async function searchImages(combo, index) {
    const galeria = document.getElementById("image-container");
    let poblacion = combo.options[index].innerHTML;
    const url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=images&titles="+ poblacion +"&gimlimit=10&prop=imageinfo&iiprop=url";

    galeria.innerHTML = "";
    let response = await fetch(url);
    let result = await response.json();
    
    if (!result.query) {
        const p = document.createElement("p");
        p.innerHTML = "No se ha encontrado ninguna imagen de esta localidad...";

        galeria.append(p);
        return;
    }

    insertImages(result, galeria)

    console.log(result)
}

function insertImages(result, galeria) {
    const images = Object.values(result.query.pages);

    images.forEach(element => {
        const img = document.createElement("img");
        img.src = element.imageinfo[0].url;
        img.width = 369;

        galeria.append(img)
    });
}

function resetCombo(combo) {
    combo.innerHTML = "";

    const option = document.createElement("option");
    option.value = "";
    option.innerHTML = "Selecciona una opción";
    option.selected = true;

    combo.append(option);
}