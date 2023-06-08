struct Texture {
 sampler2D data;
 vec2 scale;
};

uniform Texture uPattern;
uniform vec2 uMouse;
uniform float uAspect;
varying vec2 vUv;

vec4 getTexture(Texture tex) {
  vec2 uv = (vUv - 0.5) * tex.scale + 0.5;
  return texture2D(tex.data, uv);
}

void main() {
  vec3 pattern = getTexture(uPattern).rgb;

  vec2 aspect = vec2(uAspect, 1.0);
  float dist = distance(uMouse * aspect, (vUv * 2.0 - 1.0) * aspect);
  dist = 1.0 - smoothstep(0.2, 1.0, dist);
  dist = pow(dist, 2.0);
  vec3 color = mix(vec3(0), pattern, dist);

  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(pattern, 1.0);
  // gl_FragColor = vec4(vec3(dist), 1.0);
}