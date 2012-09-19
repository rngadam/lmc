// Client Code

console.log('webgl');

var gl = null;
var viewportWidth = 0;
var viewportHeight = 0;

function initGL(canvas) {
    try {
        gl = canvas.getContext("webgl");
        if (!gl)
            gl = canvas.getContext("experimental-webgl");
        if (gl) {
            viewportWidth = canvas.width;
            viewportHeight = canvas.height;
        }
    } catch (e) {
    }
    // Not the best error detection logic.
    // Redirect to http://get.webgl.org in failure case.
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

function getShader(gl, id) {
    var script = document.getElementById(id);
    if (!script) {
        return null;
    }

    var shader;
    if (script.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (script.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, script.text);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var program;

function initShaders() {
    var vertexShader = getShader(gl, "shader-vs");
    var fragmentShader = getShader(gl, "shader-fs");

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(program);

    program.positionAttr = gl.getAttribLocation(program, "positionAttr");
    gl.enableVertexAttribArray(program.positionAttr);

    program.colorAttr = gl.getAttribLocation(program, "colorAttr");
    gl.enableVertexAttribArray(program.colorAttr);
}

var buffer;

var target_multiplier = 1.0;
var previous_multiplier = 1.0;
var current_multiplier = 1.0;
var increment = 0;

// Interleave vertex positions and colors
var vertexData = [
    // X    Y     Z     R     G     B     A
    0.0,   0.8,  0.0,  1.0,  0.0,  0.0,  1.0,
    // X    Y     Z     R     G     B     A
    -0.8, -0.8,  0.0,  0.0,  1.0,  0.0,  1.0,
    // X    Y     Z     R     G     B     A
    0.8,  -0.8,  0.0,  0.0,  0.0,  1.0,  1.0
];

function initGeometry() {
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    vertexDataModified = [];
	for(var i=0;i<vertexData.length;i++) {
    	vertexDataModified[i] = vertexData[i]*current_multiplier;
    }    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexDataModified), gl.STATIC_DRAW);
}

function drawScene() {
    gl.viewport(0, 0, viewportWidth, viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    // There are 7 floating-point values per vertex
    var stride = 7 * Float32Array.BYTES_PER_ELEMENT;

    // Set up position stream
    gl.vertexAttribPointer(program.positionAttr, 3, gl.FLOAT, false, stride, 0);
    // Set up color stream
    gl.vertexAttribPointer(program.colorAttr, 4, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function webGLStart() {
    var canvas = document.getElementById("lesson02-canvas");
    initGL(canvas);
    initShaders()
    initGeometry();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.disable(gl.DEPTH_TEST);

    drawScene();
}

var lower_bound = 1.0;
var upper_bound = 1.0;
function updateTransition() {
	if(current_multiplier > upper_bound) {
		increment = -(upper_bound-lower_bound)/10.0;
	} else if(current_multiplier < lower_bound) {
		increment = (upper_bound-lower_bound)/10.0
	}
	current_multiplier += increment;

	webGLStart();
}

function updateGauge() {
	ss.rpc('system.loadavg', function(res) {
			if(res.one != target_multiplier) {
				previous_multiplier = target_multiplier;
				target_multiplier = res.one;	
				if(previous_multiplier > target_multiplier) {
					lower_bound = target_multiplier;
					upper_bound = previous_multiplier;
				} else {
					lower_bound = previous_multiplier;
					upper_bound = target_multiplier;					
				}
			}
			
	});
}
setInterval(updateTransition, 10);
setInterval(updateGauge, 1000);

