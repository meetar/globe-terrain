varying vec2 vUv;

void main() {
		
	// flip image 180 -- two iterations of this shader = two passes,
	// one starting top-left and the other starting bottom-right
	vUv = vec2(1.0) - uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
