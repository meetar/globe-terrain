
// ?
precision mediump float;
varying vec2 vUv;

uniform lowp sampler2D colorMap;
// dimensions of the image in pixels
uniform vec2 u_textureSize;
// the degree of reduction
uniform float u_divisor;

// the width and height of a single pixel, in uv space
float pixelW = 1.0 / u_textureSize.x;
float pixelH = 1.0 / u_textureSize.y;

float maxValue = 0.0;

void main (void) {

	// use progressively smaller proportions of the available texture size
	// if (vUv.x > 1.0 / u_divisor) { discard; }
	
	maxValue = max(maxValue, texture2D(colorMap, vUv).r); // sampled pixel
	maxValue = max(maxValue, texture2D(colorMap, vUv+vec2(pixelW*u_divisor, 0.0)).r); // right
	maxValue = max(maxValue, texture2D(colorMap, vUv+vec2(0.0, pixelH*u_divisor)).r); // down
	maxValue = max(maxValue, texture2D(colorMap, vUv+vec2(pixelW*u_divisor, pixelH*u_divisor)).r); // right-down

	// for (float x = 0.0; x < 1.0; x += pixelW) {
		// for (float y = 0.0; y < 1.0; y += pixelH) {
			// pixel = current pixel
			// vec4 sample = texture2D(colorMap, vec2(x, y));
			// just use r value, assuming monochrome image
			// float value = sample.r;
			
			// maxValue = max(maxValue, value);
		// }
	// }

	gl_FragColor = vec4(maxValue, maxValue, maxValue, 1.0);
	// gl_FragColor = texture2D(colorMap, vUv);

}