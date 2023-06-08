struct Texture {
 sampler2D data;
 vec2 scale;
};

uniform sampler2D tDiffuse;
uniform Texture uImage;
uniform float uFade;
varying vec2 vUv;

vec4 getTexture(Texture tex) {
  vec2 uv = (vUv - 0.5) * tex.scale + 0.5;
  return texture2D(tex.data, uv);
}

void main() {
  vec3 light = texture2D(tDiffuse, vUv).rgb;
  vec3 image = getTexture(uImage).rgb;

  vec3 final = mix(image * 0.03, image, light);
  final += light * 0.1;

  final *= 1.0 - uFade;

  gl_FragColor = vec4(final, 1.0);
}