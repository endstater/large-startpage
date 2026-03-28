const canvas = document.getElementById('gl');
const gl = canvas.getContext('webgl');

const vertexShader = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
    }
`;

const fragmentShader = `
precision highp float;
uniform float u_time;
varying vec2 v_texCoord;

float random(vec2 st) {
    return .4 + fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123)*.6;
}

void main() {
    vec2 uv = v_texCoord;
    
    vec2 cells = vec2(30.,20.);
    vec2 gridPos = floor(uv * cells);
    vec2 grid = fract(uv * cells);
    
    vec2 center = vec2(0.5);
    vec2 p = grid - center;
    float dist = sqrt(p.x*p.x+p.y*p.y);

    vec3 color = vec3((gridPos/cells).x,(gridPos/cells).y,1.-gridPos.x/cells)*(random(gridPos)*(1.-dist*(1.-random(gridPos))));

    gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
gl.useProgram(program);

const vertices = new Float32Array([
    -1, -1, 0, 0,
     1, -1, 1, 0,
    -1,  1, 0, 1,
     1,  1, 1, 1
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLoc = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);

const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
gl.enableVertexAttribArray(texCoordLoc);
gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);

const timeUniform = gl.getUniformLocation(program, "u_time");

let startTime = performance.now();

function animate() {
    const currentTime = (performance.now() - startTime) / 1000;
    
    gl.uniform1f(timeUniform, currentTime);
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    requestAnimationFrame(animate);
}

animate();