let temporizador;
let segundos = 0;
let duracionCategoria = 0; 
const limiteFaltas = 5; 


function establecerCategoria(categoria) {
    switch (categoria) {
        case 'infantil':
            duracionCategoria = 60; 
            break;
        case 'juvenil':
            duracionCategoria = 90; 
            break;
        case 'cadete':
            duracionCategoria = 120; 
            break;
        case 'adulto':
            duracionCategoria = 180; 
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
    let valorIncremento = 0; 


    if (tipo === 'ippon') {
        valorIncremento = 3;
    } else if (tipo === 'waza') {
        valorIncremento = 2; 
    } else if (tipo === 'yuko') {
        valorIncremento = 1; 
    }


    puntajeElem.innerText = parseInt(puntajeElem.innerText) + valorIncremento;
    verificarGanador(); 
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


    const checkbox = document.querySelector(`input[name="foul${jugador.charAt(0).toUpperCase() + jugador.slice(1)}"][value="${tipoFalta}"]`);
    
    if (checkbox.checked) {
        faltasActuales++;
        faltasElem.innerText = `Faltas: ${faltasActuales}`;
    } else {
        faltasActuales--;
        faltasElem.innerText = `Faltas: ${Math.max(faltasActuales, 0)}`; 
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
    document.getElementById('categoriaSelect').selectedIndex = 0; 
    const senshuRadios = document.getElementsByName('senshu');
    senshuRadios.forEach(radio => radio.checked = false); 
}
