var canvasID = "paint-canvas";
var canvas = document.getElementById(canvasID);
var context = canvas.getContext('2d');


var defaultLineWidth = 2;
var currentLineWidth = defaultLineWidth;
var defaultLineColor = '#000000';
var currentPainting = null; // if current painting already saved - so save will override it


// check if page is on edit mode
var editMode = localStorage.getItem('editPainting');
if (editMode) {
    Painting.loadPainting(editMode, canvas, false);
    localStorage.removeItem('editPainting');
    showSysMessage(editMode + ' Painting Loaded')
}



window.onload = function () {

    // Definitions
    var canvas = document.getElementById(canvasID);
    var context = canvas.getContext("2d");
    var boundings = canvas.getBoundingClientRect();

    // Specifications
    var mouseX = 0;
    var mouseY = 0;
    context.strokeStyle = defaultLineColor; // initial brush color
    context.lineWidth = defaultLineWidth; // initial brush width
    var isDrawing = false;



    function writeMousePosition(canvas, message) {
        $("#mouse-position").html(message)
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }



// listen to mouse movement
    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position <  X: ' + parseInt(mousePos.x) + ' | Y: ' + parseInt(mousePos.y) + ' >';
        writeMousePosition(canvas, message, {x: 10, y: 25});
    }, false);

// Handle Mouse Coordinates
    function setMouseCoordinates(evt) {
        let mPos = getMousePos(canvas,evt)
        mouseX = mPos.x;
        mouseY = mPos.y;
    }

    function eraserOn() {
        let eraser = $(".eraser");

        context.lineWidth = 20;
        context.strokeStyle = 'white';
        canvas.style.cursor = 'none';
        eraser.css('display','block');
        // Mouse Move Event
        canvas.addEventListener('mousemove', function (event) {
            eraser.css('top', mouseY+5);
            eraser.css('left', mouseX-5);
        });
        eraser.fadeIn();
    }

    function eraserOff() {
        let eraser = $(".eraser");
        canvas.style.cursor = 'crosshair';
        context.lineWidth = currentLineWidth;
        context.strokeStyle = defaultLineColor;
        eraser.css('display','none');
        // Mouse Move Event
        canvas.removeEventListener('mousemove', function (event) {
            $(".eraser").css('top', mouseY);
            $(".eraser").css('left', mouseX);

        });
        eraser.fadeOut();
    }



    // Select Colors
    var colors = document.getElementById('brush-color');

    colors.addEventListener('change', function (event) {
        eraserOff();
        context.lineWidth = currentLineWidth;
        defaultLineColor = event.target.value || defaultLineColor;
        context.strokeStyle = defaultLineColor;

    });

    // Select Brushes
    var brushes = document.getElementsByClassName('brushes')[0];

    brushes.addEventListener('click', function (event) {
        eraserOff();
        $('.brushes button').removeClass('selected');
        currentLineWidth = event.target.value || 1
        context.lineWidth = currentLineWidth;
        $(event.target).addClass('selected');
    });

    // Erase Event
    document.getElementById('erase').addEventListener('click', function (event) {
        eraserOn();
    });

    // Mouse Down Event
    canvas.addEventListener('mousedown', function (event) {
        setMouseCoordinates(event);
        isDrawing = true;

        // Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);
    });

    // Mouse Move Event
    canvas.addEventListener('mousemove', function (event) {
        setMouseCoordinates(event);

        if (isDrawing) {
            context.lineTo(mouseX, mouseY);
            context.stroke();
        }
    });

    // Mouse Up Event
    canvas.addEventListener('mouseup', function (event) {
        setMouseCoordinates(event);
        isDrawing = false;
    });

    // Handle Clear Button
    var clearButton = document.getElementById('clear');

    clearButton.addEventListener('click', function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Handle Save Button
    var saveToFileButton = document.getElementById('saveToFile');

    // save to file file button
    saveToFileButton.addEventListener('click', function () {
        var imageName = prompt('Please enter painting title');
        var canvasDataURL = canvas.toDataURL();
        var a = document.createElement('a');
        a.href = canvasDataURL;
        a.download = imageName || 'drawing';
        a.click();
    });

    // save to local storage button
    var saveToLocalButton = document.getElementById('saveToLocalStorage');
    saveToLocalButton.addEventListener('click', function () {
        let isNew = false;
        if (!currentPainting) {
            currentPainting = prompt('Please enter painting title');
            if (currentPainting == '') {
                showSysMessage('Saving Error - Please Specify painting title', 'error');
                return;
            }
            isNew = true;
        }
        let imageName = currentPainting;
        Painting.savePainting(imageName, canvas, isNew);
    });

};
