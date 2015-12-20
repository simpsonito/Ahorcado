/* Creado por Adib on 19/12/15.*/
var palabras;
var pActual = 0;
var MAX_ERRORES = 5;//Aquí poner la última imagen
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
};
var Ahorcado;
var retroIndividual;

window.addEventListener("load", function(){
    var imagen = document.body.querySelector(".ahorcado > img");
    palabras = document.body.querySelectorAll(".ord");
    Array.prototype.forEach.call(palabras, function(elemento){
        var caracterAleatorio = elemento.innerHTML.charAt(Math.floor(Math.random() * elemento.innerHTML.length));
        prepararPalabra(elemento);
        revisarCaracter(caracterAleatorio, elemento);
    });
    Ahorcado = (function(){
        var contadorErrores = 0;
        var objeto = Object.create(Object);
        Object.defineProperty(objeto, 'numErrores', {
            get: function() {
                //console.log("obtenido");
                return contadorErrores;
            },
            set: function(newValue) {
                //console.log(imagen.src);
                if(newValue <= MAX_ERRORES){
                    contadorErrores = newValue;
                    imagen.src = "imagenes/" + contadorErrores + ".png";
                    if(newValue == MAX_ERRORES){
                        //console.log("se quemó, terminó el juego");
                        retroIndividual.mostrar("¡Lástima! Obtuviste " + pActual +  " de " + palabras.length + ".");
                        desactivarBotones(botones, true);
                        //TODO enviar a moodle hasta ahí
                    } else {
                        retroIndividual.mostrar("Incorrecto. Te quedan " + (MAX_ERRORES-contadorErrores) +  " oportunidades.");
                    }
                }
            },
            enumerable: false,
            configurable: false
        });

        return objeto;
    })();

    activarPalabra(palabras[pActual]);

    var botones = document.body.querySelectorAll(".alfabeto > button");
    Array.prototype.forEach.call(botones, function(boton){
        boton.addEventListener("click", function(e){
            var resultado = revisarCaracter(e.currentTarget.innerHTML, palabras[pActual]);
            console.log("resultado: ", resultado);
            e.currentTarget.disabled = true;
            if(resultado === "fin"){
                if(++pActual === palabras.length){
                    retroIndividual.mostrar("¡Excelente! Encontraste todas las palabras.");
                    desactivarBotones(botones, true);
                    //TODO cuando tiene todas las palabras resueltas (enviar a moodle como terminado)
                } else {
                    activarPalabra(palabras[pActual], botones);
                }
            } else if(resultado === "bien"){

            } else if(resultado === "mal") {
                Ahorcado.numErrores++;
            }
        });
    });

    //RetroIndividual
    retroIndividual = (function(){
        var retroFinal = document.getElementById("retroFinal");
        var mensajeFinal = document.getElementById("retroFinalMensaje");
        retroFinal.addEventListener("click", quitarRetro, false);
        document.getElementById("botonCerrarRetro").addEventListener("click", quitarRetro, false);
        function quitarRetro(){
            retroFinal.style.display = "none";
        }
        function darRetroPop(mensaje) {
            retroFinal.style.display = "";
            mensajeFinal.innerHTML = mensaje;
        }
        return {mostrar:darRetroPop}
    })();
    //Fin RetroIndividual

}, false);

function prepararPalabra(nodo){
    var texto = nodo.innerHTML;
    var incognita = texto.replace(/[a-zñ]/gi, "_");
    nodo.setAttribute("data-original", texto);
    nodo.innerHTML = incognita;

}
function activarPalabra(nodo, botones){
    nodo.parentNode.className += " activa";
    var anterior = nodo.parentNode.previousElementSibling;
    if(anterior !== null){
        anterior.className = anterior.className.replace("activa", "inactiva");
    }
    if(botones !== undefined){
        desactivarBotones(botones, false);
    }
}
function desactivarBotones(botones, cierto){
    Array.prototype.forEach.call(botones, function(boton){
        boton.disabled = cierto;
    });
    botones[0].parentNode.scrollIntoView();
}

function revisarCaracter(letra, nodo){
    var original = nodo.getAttribute("data-original");
    var resultados = buscarCaracteres(letra, original);
    var modificando = nodo.innerHTML;
    resultados.forEach(function(elemento){
        modificando = modificando.replaceAt(elemento,letra);
    });
    //console.log("modificando", modificando, original);
    nodo.innerHTML = modificando;
    if(modificando === original){
        //console.log("terminó!!");
        return "fin";
    } else if(resultados.length > 0) {
        //console.log("encontró!!");
        return "bien";
    } else {
        //console.log("NADA!");
        return "mal";
    }
}
function buscarCaracteres(char, texto){
    var myRe = new RegExp(char, "gi");
    var str = texto;
    var resultado = [];
    //var myArray;
    while ((myRe.exec(str)) !== null) {
    //while ((myArray = myRe.exec(str)) !== null) {
        /*
        var msg = 'Found ' + myArray[0] + '. ';
        msg += 'Next match starts at ' + (myRe.lastIndex-1);
        console.log(msg);
        */
        resultado.push(myRe.lastIndex-1);
    }
    return resultado;
}