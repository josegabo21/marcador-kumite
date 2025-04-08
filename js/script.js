let temporizador;
let segundos = 0;
let duracionCategoria = 0; // Duración del combate en segundos
const limiteFaltas = 5; // Límite de faltas para descalificación

// Establecer la duración del combate según la categoría
function establecerCategoria(categoria) {
    switch (categoria) {
        case 'infantil':
            duracionCategoria = 60; // 1:00 minutos
            break;
        case 'juvenil':
            duracionCategoria = 90; // 1:30 minutos
            break;
        case 'cadete':
            duracionCategoria = 120; // 2:00 minutos
            break;
        case 'adulto':
            duracionCategoria = 180; // 3:00 minutos
            break;
        default:
            duracionCategoria = 0;
    }
}

function iniciarTemporizador() {
    if (!temporizador) {
        temporizador = setInterval(() => {
            segundos++;
            document.getElementById('temporizador').innerText = new Date(segundos * 1000).toISOString().substr(11, 8);
            if (segundos >= duracionCategoria) {
                detenerTemporizador();
                determinarGanador();
            }
        }, 1000);
    }
}

function detenerTemporizador() {
    clearInterval(temporizador);
    temporizador = null;
}

function incrementarPuntaje(jugador, tipo) {
    const puntajeElem = document.getElementById(`puntaje${jugador.charAt(0).toUpperCase() + jugador.slice(1)}`);
    let valorIncremento = 0; // Inicializar el valor de incremento

    // Determinar el valor de incremento según el tipo
    if (tipo === 'ippon') {
        valorIncremento = 3; // IPPON = 3 puntos
    } else if (tipo === 'waza') {
        valorIncremento = 2; // WAZA = 2 puntos
    } else if (tipo === 'yuko') {
        valorIncremento = 1; // YUKO = 1 punto
    }

    // Incrementar el puntaje
    puntajeElem.innerText = parseInt(puntajeElem.innerText) + valorIncremento;
    verificarGanador(); // Verificar si hay un ganador después de incrementar el puntaje
}

function decrementarPuntaje(jugador) {
    const puntajeElem = document.getElementById(`puntaje${jugador.charAt(0).toUpperCase() + jugador.slice(1)}`);
    puntajeElem.innerText = Math.max(0, parseInt(puntajeElem.innerText) - 1);
}

function incrementarFalta(jugador, tipo) {
    const faltasElem = document.getElementById(`faltas${jugador.charAt(0).toUpperCase() + jugador.slice(1)}`);
    let faltasActuales = parseInt(faltasElem.innerText.split(': ')[1]);
    faltasActuales++;
    faltasElem.innerText = `Faltas: ${faltasActuales}`;
    verificarDescalificacion(jugador, faltasActuales);
}

function seleccionarFalta(jugador, tipoFalta, puntos) {
    const faltasElem = document.getElementById(`faltas${jugador.charAt(0).toUpperCase() + jugador.slice(1)}`);
    let faltasActuales = parseInt(faltasElem.innerText.split(': ')[1]);

    // Verificar si el checkbox está seleccionado
    const checkbox = document.querySelector(`input[name="foul${jugador.charAt(0).toUpperCase() + jugador.slice(1)}"][value="${tipoFalta}"]`);
    
    if (checkbox.checked) {
        // Si está seleccionado, incrementar las faltas
        faltasActuales++;
        faltasElem.innerText = `Faltas: ${faltasActuales}`;
    } else {
        // Si se deselecciona, decrementar las faltas si es necesario
        faltasActuales--;
        faltasElem.innerText = `Faltas: ${Math.max(faltasActuales, 0)}`; // Asegurarse de que no sea negativo
    }
}

function verificarDescalificacion(jugador, faltasActuales) {
    if (faltasActuales >= limiteFaltas) {
        alert(`${jugador.toUpperCase()} ha sido descalificado por ${faltasActuales} faltas.`);
        detenerTemporizador();
        reiniciarPuntajesYFaltas();
    }
}

function reiniciarPuntajesYFaltas() {
    const jugadores = ['ao', 'aka'];
    jugadores.forEach(jugador => {
        document.getElementById(`puntaje${jugador.charAt(0).toUpperCase() + jugador.slice(1)}`).innerText = '0';
        document.getElementById(`faltas${jugador.charAt(0).toUpperCase() + jugador.slice(1)}`).innerText = 'Faltas: 0';
    });
}

function verificarGanador() {
    const puntajeAo = parseInt(document.getElementById('puntajeAo').innerText);
    const puntajeAka = parseInt(document.getElementById('puntajeAka').innerText);

    // Verificar si hay un ganador basado en la diferencia de puntajes
    if (puntajeAo >= 8 || puntajeAka >= 8) {
        const senshu = document.querySelector('input[name="senshu"]:checked') ? document.querySelector('input[name="senshu"]:checked').value : '';
        detenerTemporizador();
        if (puntajeAo >= 8 && puntajeAka >= 8) {
            if (senshu === 'ao') {
                alert('AO gana por Senshu!');
            } else if (senshu === 'aka') {
                alert('AKA gana por Senshu!');
            } else {
                alert('El combate termina en empate!');
            }
        } else {
            alert(puntajeAo >= 8 ? 'AO gana por diferencia de puntos!' : 'AKA gana por diferencia de puntos!');
        }
    }
}

function determinarGanador() {
    const puntajeAo = parseInt(document.getElementById('puntajeAo').innerText);
    const puntajeAka = parseInt(document.getElementById('puntajeAka').innerText);
    const faltasAo = parseInt(document.getElementById('faltasAo').innerText.split(': ')[1]);
    const faltasAka = parseInt(document.getElementById('faltasAka').innerText.split(': ')[1]);

    if (puntajeAo > puntajeAka) {
        alert('AO gana el combate!');
    } else if (puntajeAka > puntajeAo) {
        alert('AKA gana el combate!');
    } else {
        // Empate
        const senshu = document.querySelector('input[name="senshu"]:checked') ? document.querySelector('input[name="senshu"]:checked').value : '';
        if (senshu === 'ao') {
            alert('AO gana por Senshu!');
        } else if (senshu === 'aka') {
            alert('AKA gana por Senshu!');
        } else {
            if (faltasAo < faltasAka) {
                alert('AO gana por menor cantidad de faltas!');
            } else if (faltasAka < faltasAo) {
                alert('AKA gana por menor cantidad de faltas!');
            } else {
                alert('El combate termina en empate!');
            }
        }
    }
    reiniciarPuntajesYFaltas();
}

function reiniciarJuego() {
    detenerTemporizador();
    segundos = 0;
    document.getElementById('temporizador').innerText = '00:00';
    reiniciarPuntajesYFaltas();
    document.getElementById('categoriaSelect').selectedIndex = 0; // Resetear la categoría
    const senshuRadios = document.getElementsByName('senshu');
    senshuRadios.forEach(radio => radio.checked = false); // Resetear Senshu
}