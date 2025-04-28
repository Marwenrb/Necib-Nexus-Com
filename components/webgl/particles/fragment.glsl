uniform float uTime;
uniform vec3 uColor;

void main() {
  float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
  float strength = 0.03 / distanceToCenter - 0.06;
  
  strength = clamp(strength, 0.0, 0.7);
  
  gl_FragColor = vec4(uColor, strength);
}