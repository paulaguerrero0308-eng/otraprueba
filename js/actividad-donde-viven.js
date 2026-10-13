document.addEventListener("DOMContentLoaded", () => {
    const escenarioHabitat = document.getElementById("escenario-habitat");
    const contenedorAnimales = document.getElementById("contenedor-animales");
    const piwiNarrador = document.getElementById("piwi-narrador");

    const audioInstruccion = document.getElementById("audio-instruccion");
    const audioCorrecto = document.getElementById("audio-correcto");
    const audioIncorrecto = document.getElementById("audio-incorrecto");

    const RUTA_PIWI_GIF = "../gif/Pajarito oficial lento.gif";
    const RUTA_PIWI_STATIC = "../img/piwi.png";

    // --- POSICIONES BASE REUTILIZABLES PARA QUE QUEDEN BIEN DISTRIBUIDOS ---
    const posicionesBase = [
        { top: "18%", left: "10%" },
        { top: "20%", left: "62%" },
        { top: "52%", left: "18%" },
        { top: "50%", left: "68%" }
    ];

    // --- CONFIGURACIÓN DE RONDAS CON ANIMALES DISPONIBLES ---
    const rondas = [
        {
            nombre: "Agua",
            fondo: "../img/actividaddondeviven/Nadan - fondo .png",
            animales: [
                { src: "../img/nadan/Delfin - grande .png", esIntruso: false, width: "130px" },
                { src: "../img/nadan/Tortuga -Grande .png", esIntruso: false, width: "120px" },
                { src: "../img/nadan/Ballena - grande .png", esIntruso: false, width: "150px" },
                { src: "../img/saltan/Grillo - grande .png", esIntruso: true, width: "90px" } // INTRUSO
            ]
        },
        {
            nombre: "Bosque",
            fondo: "../img/actividaddondeviven/bosque - fondo .png",
            animales: [
                { src: "../img/vuelan/Ave -grande .png", esIntruso: false, width: "95px" },
                { src: "../img/vuelan/Loro - grande .png", esIntruso: false, width: "100px" },
                { src: "../img/vuelan/Mariposa - grande .png", esIntruso: false, width: "90px" },
                { src: "../img/nadan/Pez - grande .png", esIntruso: true, width: "110px" } // INTRUSO
            ]
        },
        {
            nombre: "Campo",
            fondo: "../img/actividaddondeviven/campo - fondo .png",
            animales: [
                { src: "../img/caminanycorren/Caballo - grande .png", esIntruso: false, width: "135px" },
                { src: "../img/caminanycorren/Cachorrog .png", esIntruso: false, width: "110px" },
                { src: "../img/caminanycorren/Gato - grande .png", esIntruso: false, width: "100px" },
                { src: "../img/nadan/Delfin - grande .png", esIntruso: true, width: "125px" } // INTRUSO
            ]
        }
    ];

    let rondaActual = 0;

    // Función para mezclar elementos al azar
    function mezclarArreglo(arreglo) {
        return [...arreglo].sort(() => Math.random() - 0.5);
    }

    function cargarRonda(index) {
        if (index >= rondas.length) {
            // Juego completado
            if (audioCorrecto) audioCorrecto.play().catch(() => {});
            setTimeout(() => {
                window.location.href = "intro-animales.html";
            }, 1500);
            return;
        }

        const ronda = rondas[index];

        // Cambiar fondo del hábitat
        escenarioHabitat.style.backgroundImage = `url('${ronda.fondo}')`;
        contenedorAnimales.innerHTML = "";

        // Mezclar animales y posiciones para que no siempre salgan en el mismo sitio
        const animalesMezclados = mezclarArreglo(ronda.animales);
        const posicionesMezcladas = mezclarArreglo(posicionesBase);

        // Renderizar animales con posiciones aleatorias
        animalesMezclados.forEach((animalData, i) => {
            const pos = posicionesMezcladas[i];
            const img = document.createElement("img");
            img.src = animalData.src;
            img.classList.add("animal-item");
            img.style.top = pos.top;
            img.style.left = pos.left;
            img.style.width = animalData.width;

            img.addEventListener("click", () => evaluarSeleccion(animalData.esIntruso, img));
            contenedorAnimales.appendChild(img);
        });
    }

    function evaluarSeleccion(esIntruso, elementoImg) {
        if (esIntruso) {
            // ¡Acierto! Encontró al animal perdido
            if (audioCorrecto) {
                audioCorrecto.currentTime = 0;
                audioCorrecto.play().catch(() => {});
            }

            if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_GIF;

            // Animación de salida para la imagen
            elementoImg.style.transform = "scale(1.4) rotate(15deg)";
            elementoImg.style.opacity = "0.3";

            setTimeout(() => {
                if (piwiNarrador) piwiNarrador.src = RUTA_PIWI_STATIC;
                rondaActual++;
                cargarRonda(rondaActual);
            }, 1500);

        } else {
            // Error: Seleccionó un animal nativo
            if (audioIncorrecto) {
                audioIncorrecto.currentTime = 0;
                audioIncorrecto.play().catch(() => {});
            }

            // Pequeña animación de error
            elementoImg.style.transform = "scale(0.9)";
            setTimeout(() => {
                elementoImg.style.transform = "scale(1)";
            }, 200);
        }
    }

    // Iniciar el juego
    cargarRonda(rondaActual);
});