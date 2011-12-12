/// <reference path="jquery-1.6.4-vsdoc.js" />
/// <reference path="jquery-1.6.4.js" />

var preloader = (function (global) {
    var loadedcount = 0;
    var max;
    return function preloader() {
        var instance = this;
        this.loadImageArray = function (array) {
            if (array !== undefined) {
                loadedcount = 0;
                max = array.length;
                for (var i = 0; i < array.length; i++) {
                    var item = array[i];
                    instance.loadImage(item);
                }
            }
        };
        this.loadImage = function (url) {
            var img = new Image();
            img.src = url;
            img.onload = function () { complete(false, this); };
            img.onerror = function (e) { complete(true, this); };
        };
        function complete(error, element) {
            if (error) {
                console.log('Error downloading image ' + element.src);
            }
            loadedcount++;
            instance.progress(element);
            if (loadedcount == max) {
                instance.completed(loadedcount);
            }

        }
    };


})(this);

preloader.prototype =
{
    completed: function () { },
    progress: function (element) { },
    onerror: function (e) { return true; }
};

var progressLoader = (function (global) {
    var instance = this;
    return function progressLoader(count) {
        var loaderCount = 0;
        var internalCount = count;
        this.loadImageArray = function (array) {
            var loader = new preloader();
            loader.completed = this.loadedCompleted;
            loader.loadImageArray(array);
        };
        this.loadedCompleted = function () {
            loaderCount++;
          //  console.log('pack completed' + new Date().toGMTString());
            if (loaderCount == internalCount) {
                instance.completed();
            }
        }
    };
})(this);

progressLoader.prototype =
{
    completed: function () { }
};

var imagesValues = new Array();
var characterValues = new Array();
var rainValues = new Array();
var myLoader = new preloader();

$(document).ready(startAnimationEngine);

function startAnimationEngine() {    
    var functionsIndex = 0;
    var functions = [];
    functions.push(loadCharacters);
    functions.push(loadItems);
    functions.push(loadMainBackgrounds);

    myLoader.progress = function () {
        var w = $('#loadingProgress');
        w.width(w.width() + 1);
    };
    myLoader.completed = function () {
        functionsIndex++;
        if (functionsIndex < functions.length) {
            functions[functionsIndex]();
        }
        else {
            $('#loadingProgress').remove();
            setTimeout(changeNextBackground, 1000);
            setTimeout(startAnimateCharacter, 1000);
        }
    };

    functions[functionsIndex]();
}



function loadMainBackgrounds() {
    imagesValues.push('Images/backgrounds/cap01_jef01_lalengua.jpg');
    imagesValues.push('Images/backgrounds/cap01_jef02_Sato.jpg');
    imagesValues.push('Images/backgrounds/cap01_jef03_naia.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP01_enelcalordelanoche.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP02_debod.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP03_elliderquenuncaquisoserlo.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP04_listo.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP05_infectadoseinfiltrados.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP06_abrazomortal.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP07_lamontanayelgato.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP08_naiaysato.jpg');
    imagesValues.push('Images/backgrounds/cap01_mP09_lalagrimaenlahierba.jpg');
    imagesValues.push('Images/backgrounds/cap01_mS01_rompecontodo.jpg');
    imagesValues.push('Images/backgrounds/cap01_mS02_continuatuentrenamiento.jpg');
    imagesValues.push('Images/backgrounds/cap01_mS03_entreladrones.jpg');
    imagesValues.push('Images/backgrounds/cap01_mS04_motosierra.jpg');
    imagesValues.push('Images/backgrounds/cap01_mS05_practicasdetiro.jpg');
    imagesValues.push('Images/backgrounds/skyline_madridenllamas_660px.jpg');
    myLoader.loadImageArray(imagesValues);
}

function loadCharacters() {
    characterValues.push('Images/characters/cientifica_joven_a.png');
    characterValues.push('Images/characters/cientifica_joven_b.png');
    characterValues.push('Images/characters/cientifico_hvcopy.png');
    characterValues.push('Images/characters/cientifico_mvja.png');
    characterValues.push('Images/characters/Espia_HJcopy.png');
    characterValues.push('Images/characters/Espia_HV_capascopy.png');
    characterValues.push('Images/characters/Espia_MJ_capascopy.png');
    characterValues.push('Images/characters/Espia_MV_capascopy.png');
    characterValues.push('Images/characters/Expoli_HJ_capascopy.png');
    characterValues.push('Images/characters/Expoli_Hvcopy.png');
    characterValues.push('Images/characters/Expoli_Mjcopy.png');
    characterValues.push('Images/characters/Expoli_MV_capas_nuevoculillocopy.png');
    characterValues.push('Images/characters/Hacker_HJ_CAPAScopy.png');
    characterValues.push('Images/characters/Hacker_hvj_CAPAScopy.png');
    characterValues.push('Images/characters/Hacker_mj_CAPAScopy.png');
    characterValues.push('Images/characters/Hacker_mviejaj_CAPAScopy.png');
    characterValues.push('Images/characters/ladron_hjcopy.png');
    characterValues.push('Images/characters/ladron_hv_copy.png');
    characterValues.push('Images/characters/ladron_mv_mascaracopy.png');
    characterValues.push('Images/characters/ladron_ninacopy.png');
    characterValues.push('Images/characters/medica_jovencopy.png');
    characterValues.push('Images/characters/medico_hjcopy.png');
    characterValues.push('Images/characters/medico_hvcopy.png');
    characterValues.push('Images/characters/medico_mvcopy.png');
    characterValues.push('Images/characters/normal_currantecopy.png');
    characterValues.push('Images/characters/normal_evacopy.png');
    characterValues.push('Images/characters/normal_housewifecopy.png');
    characterValues.push('Images/characters/normal_telepicopy.png');


    myLoader.loadImageArray(characterValues);
}

function loadItems() {
    rainValues.push('Images/Iconos/anillo-localizador.png');
    rainValues.push('Images/Iconos/arco.png');
    rainValues.push('Images/Iconos/arma-blanca.png');
    rainValues.push('Images/Iconos/botiquin.png');
    rainValues.push('Images/Iconos/brazo.png');
    rainValues.push('Images/Iconos/calamar.png');
    rainValues.push('Images/Iconos/cerdito.png');
    rainValues.push('Images/Iconos/cerdo-yena.png');
    rainValues.push('Images/Iconos/chaleco-antibalas.png');
    rainValues.push('Images/Iconos/cigarro.png');
    rainValues.push('Images/Iconos/cranco-perro.png');
    rainValues.push('Images/Iconos/dinoburro.png');
    rainValues.push('Images/Iconos/doscabezas.png');
    rainValues.push('Images/Iconos/eskopeta.png');
    rainValues.push('Images/Iconos/exoeskeleto.png');
    rainValues.push('Images/Iconos/fusco.png');
    rainValues.push('Images/Iconos/gato-negro.png');
    rainValues.push('Images/Iconos/gato-rayas.png');
    rainValues.push('Images/Iconos/gorra-gafas.png');
    rainValues.push('Images/Iconos/gps.png');
    rainValues.push('Images/Iconos/guante.png');
    rainValues.push('Images/Iconos/hacha.png');
    rainValues.push('Images/Iconos/icono-amarillo.png');
    rainValues.push('Images/Iconos/icono-azul.png');
    rainValues.push('Images/Iconos/inhibidor.png');
    rainValues.push('Images/Iconos/jeringa.png');
    rainValues.push('Images/Iconos/jeringaa.png');
    rainValues.push('Images/Iconos/jeringab.png');
    rainValues.push('Images/Iconos/lata1.png');
    rainValues.push('Images/Iconos/lata2.png');
    rainValues.push('Images/Iconos/lata3.png');
    rainValues.push('Images/Iconos/latigo.png');
    rainValues.push('Images/Iconos/lince-alado.png');
    rainValues.push('Images/Iconos/loromartillo.png');
    rainValues.push('Images/Iconos/makina-cientifica.png');
    rainValues.push('Images/Iconos/marsupial.png');
    rainValues.push('Images/Iconos/metralleta.png');
    rainValues.push('Images/Iconos/micro.png');
    rainValues.push('Images/Iconos/microcamara.png');
    rainValues.push('Images/Iconos/microgun.png');
    rainValues.push('Images/Iconos/microuzi.png');
    rainValues.push('Images/Iconos/mochila.png');
    rainValues.push('Images/Iconos/monopulpo.png');
    rainValues.push('Images/Iconos/motosierra.png');
    rainValues.push('Images/Iconos/motosierradoble.png');
    rainValues.push('Images/Iconos/movilviejo.png');
    rainValues.push('Images/Iconos/no-hay-objeto-azul.png');
    rainValues.push('Images/Iconos/no-hay-objeto.png');
    rainValues.push('Images/Iconos/notebook.png');
    rainValues.push('Images/Iconos/ojos.png');
    rainValues.push('Images/Iconos/ososangriento-arma.png');
    rainValues.push('Images/Iconos/ososangriento-botas.png');
    rainValues.push('Images/Iconos/ososangriento-casco.png');
    rainValues.push('Images/Iconos/ososangriento-cinturon.png');
    rainValues.push('Images/Iconos/ososangriento-coraza.png');
    rainValues.push('Images/Iconos/ososangriento-guantes.png');
    rainValues.push('Images/Iconos/palita.png');
    rainValues.push('Images/Iconos/pastilla1.png');
    rainValues.push('Images/Iconos/pastilla2.png');
    rainValues.push('Images/Iconos/pastilla3.png');
    rainValues.push('Images/Iconos/perrito.png');
    rainValues.push('Images/Iconos/perro-esfinge.png');
    rainValues.push('Images/Iconos/perrobot.png');
    rainValues.push('Images/Iconos/piernas.png');
    rainValues.push('Images/Iconos/pill1.png');
    rainValues.push('Images/Iconos/pill2.png');
    rainValues.push('Images/Iconos/pill3.png');
    rainValues.push('Images/Iconos/pistola-agua.png');
    rainValues.push('Images/Iconos/pistola.png');
    rainValues.push('Images/Iconos/pistosable.png');
    rainValues.push('Images/Iconos/porra.png');
    rainValues.push('Images/Iconos/proveta.png');
    rainValues.push('Images/Iconos/rollover-amarillo.png');
    rainValues.push('Images/Iconos/rollover-azul.png');
    rainValues.push('Images/Iconos/rosita.png');
    rainValues.push('Images/Iconos/sacacorchos.png');
    rainValues.push('Images/Iconos/smartphone.png');
    rainValues.push('Images/Iconos/spry.png');
    rainValues.push('Images/Iconos/tarro1.png');
    rainValues.push('Images/Iconos/tarro2.png');
    rainValues.push('Images/Iconos/tarro3.png');
    rainValues.push('Images/Iconos/taser.png');
    rainValues.push('Images/Iconos/tasergun.png');
    rainValues.push('Images/Iconos/teaser.png');
    rainValues.push('Images/Iconos/teaser1.png');
    rainValues.push('Images/Iconos/tirachinas.png');
    rainValues.push('Images/Iconos/usb.png');
    rainValues.push('Images/Iconos/zorro.png');

    myLoader.loadImageArray(rainValues);
}