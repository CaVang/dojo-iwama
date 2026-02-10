export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform sampler2D uMask;
uniform vec2 uResolution;
uniform float uEdgeThreshold;
varying vec2 vUv;

float luminance(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

float sobelEdge(sampler2D tex, vec2 uv, vec2 texel) {
  float tl = luminance(texture2D(tex, uv + vec2(-texel.x,  texel.y)).rgb);
  float t  = luminance(texture2D(tex, uv + vec2( 0.0,      texel.y)).rgb);
  float tr = luminance(texture2D(tex, uv + vec2( texel.x,  texel.y)).rgb);
  float l  = luminance(texture2D(tex, uv + vec2(-texel.x,  0.0)).rgb);
  float r  = luminance(texture2D(tex, uv + vec2( texel.x,  0.0)).rgb);
  float bl = luminance(texture2D(tex, uv + vec2(-texel.x, -texel.y)).rgb);
  float b  = luminance(texture2D(tex, uv + vec2( 0.0,     -texel.y)).rgb);
  float br = luminance(texture2D(tex, uv + vec2( texel.x, -texel.y)).rgb);

  float gx = -tl - 2.0 * l - bl + tr + 2.0 * r + br;
  float gy = -tl - 2.0 * t - tr + bl + 2.0 * b + br;

  return sqrt(gx * gx + gy * gy);
}

void main() {
  vec4 color = texture2D(uTexture, vUv);
  float maskValue = texture2D(uMask, vUv).r;

  vec2 texel = 1.0 / uResolution;
  float edge = sobelEdge(uTexture, vUv, texel);

  if (maskValue > 0.5) {
    // Body: strong line art (black lines on white)
    float line = edge > uEdgeThreshold ? 0.0 : 1.0;
    gl_FragColor = vec4(vec3(line), 1.0);
  } else {
    // Background: muted original video
    float gray = luminance(color.rgb);
    vec3 muted = mix(vec3(gray), color.rgb, 0.3);
    gl_FragColor = vec4(muted * 0.6, 1.0);
  }
}
`;
