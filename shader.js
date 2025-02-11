console.clear();
gsap.registerPlugin(CustomEase);

const vertex = `
  precision mediump float;

  attribute vec2 aVertexPosition;
  attribute vec2 aUvs;
  attribute vec2 aIPos;
  attribute vec3 aICol;
  attribute float duration;
  attribute float easeY;

  uniform mat3 translationMatrix;
  uniform mat3 projectionMatrix;
  uniform float time;

  varying vec2 vUvs;
  varying vec3 vColor;
  varying float vProgress;
  varying float vEaseY;

  void main() {
    vColor = aICol;
    vUvs = aUvs;
    vEaseY = easeY;
    vProgress = clamp(time, 0.0, duration) / duration;
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition + aIPos, 1.0)).xy, 0.0, 1.0);
  }
`;

const fragment = `
  precision mediump float;

  uniform float time;
  uniform sampler2D uSampler2;

  varying vec2 vUvs;
  varying vec3 vColor;
  varying float vProgress;
  varying float vEaseY;
  
  float circle(vec2 uvs, float r) {
    vec2 dist = uvs - vec2(0.5);
    return 1.0 - smoothstep(r - (r * 0.01), r + (r * 0.01), dot(dist, dist) *4.0);
  }

  float light(vec2 uv, float size) {
    size *= size;
    return size / dot(uv, uv);
  }
      
  void main() {
    vec2 pos = vUvs - vec2(0.5);  
    float easeProgress = texture2D(uSampler2, vec2(vProgress, vEaseY)).r;
    
    // Create a fade-in effect in the first 20% of the animation
    float fadeIn = smoothstep(0.0, 0.4, vProgress);
    // Create a fade-out effect in the last 20% of the animation
    float fadeOut = 1.0 - smoothstep(0.8, 1.0, vProgress);
    // Combine the fade effects
    float fade = fadeIn * fadeOut;
    
    float size = 0.1 * (fade);
    vec3 color = vColor * light(pos, size);
    float a = circle(vUvs, size);

    gl_FragColor = vec4(color, a);  
  }
`;

const app = new PIXI.Application();
document.body.appendChild(app.view);

let texture = createRoughEases();
texture = PIXI.Texture.from(texture);

const size = 3;

const geometry = new PIXI.Geometry()
    .addAttribute("aVertexPosition",
        [
            -size, -size,
            size, -size,
            size, size,
            -size, size
        ],
        2
    )
    .addAttribute("aUvs",
        [
            0, 0,
            1, 0,
            1, 1,
            0, 1
        ],
        2
    )
    .addIndex([0, 1, 2, 0, 2, 3]);

geometry.instanced = true;
geometry.instanceCount = 1000;

const positionSize = 2;
const colorSize = 3;
const durationSize = 1;

const attributes = createAttributes({
    aIPos: 2,
    aICol: 3,
    duration: 1,
    easeY: 1
});

const buffer = new PIXI.Buffer(new Float32Array(geometry.instanceCount * attributes.stride));

attributes.addToGeometry(geometry, buffer);

const randomY = gsap.utils.random(0, 10, 1, true);

for (let i = 0; i < geometry.instanceCount; i++) {
    const instanceOffset = i * attributes.stride;

    buffer.data[instanceOffset + 0] = gsap.utils.random(-400, 400);
    buffer.data[instanceOffset + 1] = gsap.utils.random(-300, 300);
    buffer.data[instanceOffset + 2] = Math.random();
    buffer.data[instanceOffset + 3] = Math.random();
    buffer.data[instanceOffset + 4] = Math.random();

    // duration
    buffer.data[instanceOffset + 5] = gsap.utils.random(5, 9);

    // ease row
    buffer.data[instanceOffset + 6] = randomY() / 20;
}

const shader = PIXI.Shader.from(vertex, fragment, {
    time: 0,
    uSampler2: texture
});

const state = new PIXI.State();
const quad = new PIXI.Mesh(geometry, shader, state);
state.blend = true;
state.blendMode = PIXI.BLEND_MODES.NORMAL_NPM;
quad.position.set(400, 300);
app.stage.addChild(quad);

gsap.to(shader.uniforms, {
    duration: 15,
    time: 10,
    repeat: -1
});

function createAttributes(sizes) {
    const attrs = {};
    const keys = Object.keys(sizes);
    let stride = 0;

    keys.forEach(key => {
        const size = sizes[key];
        const offset = stride * 4; // 4 bytes
        stride += size;
        attrs[key] = {
            size, offset
        }
    });

    function addToGeometry(geometry, buffer) {
        keys.forEach(key => {
            const attr = attrs[key];
            geometry.addAttribute(
                key,
                buffer,
                attr.size,
                false,
                PIXI.TYPES.FLOAT,
                4 * stride, // 4 bytes
                attr.offset,
                true
            );
        });
        return geometry;
    }

    return { stride, attrs, addToGeometry };
}

function createRoughEases(count = 20) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = count;

    const randomTaper = gsap.utils.random(["out", "both", "none"], true);
    const eases = []

    for (let i = 0; i < count; i++) {
        const ease = CustomEase.create("custom", "0.64,0,0.78,0");
        eases.push(ease);
    }

    eases.forEach((ease, y) => {
        for (let x = 0; x < 100; x++) {
            const c = ease(x / 99) * 255;
            ctx.fillStyle = `rgb(${c}, ${c}, ${c})`;
            ctx.fillRect(x, y, 1, 1);
        }
    });

    document.body.append(canvas);
    return canvas;
}
