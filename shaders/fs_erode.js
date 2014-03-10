// ?
precision mediump float;

uniform lowp sampler2D colorMap;
uniform vec2 u_textureSize;
varying vec2 vUv;

// the width and height of a single pixel, in uv space
float pixelW = 1.0 / u_textureSize.x;
float pixelH = 1.0 / u_textureSize.y;

float intensity = 1.0;
uniform float u_erode;

const int size = 1; //modify sampling kernel if needed
float Infinity = 100000.0;

#define between(v,x1,x2) (v> x1 && v<x2)

void main (void) {

	// pixel = current pixel
	vec4 pixel = texture2D(colorMap, vUv);
	// just use r value, assuming monochrome image
	float value = pixel.r;
		
	float minimum = Infinity;
	
	// 3x3 Shih-Wu kernel
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(-pixelW, 0.0)).r + u_erode); // left
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(0.0, -pixelH)).r + u_erode); // up
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(-pixelW, -pixelH)).r + u_erode*1.41421356); // up-left
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(pixelW, -pixelH)).r + u_erode*1.41421356); // up-right

	// 5x5 Shih-Wu kernel additional samples
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(-pixelW*2.0, 0.0)).r + u_erode *2.0); // left-left
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(-pixelW*2.0, -pixelH)).r + u_erode *2.23606798); // up-left-left
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(-pixelW*2.0, -pixelH*2.0)).r + u_erode *2.82842712); // up-up-left-left
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(-pixelW, -pixelH*2.0)).r + u_erode *2.23606798); // up-up-left
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(0.0, -pixelH*2.0)).r + u_erode *2.0); // up-up
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(pixelW, -pixelH*2.0)).r + u_erode *2.23606798); // up-up-right
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(pixelW*2.0, pixelH*2.0)).r + u_erode *2.82842712); // up-up-right-right
	minimum = min(minimum, texture2D(colorMap, vUv+vec2(pixelW*2.0, pixelH)).r + u_erode *2.23606798); // up-right-right
	
	if (value > minimum) {
		// dim pixel to slightly brighter than its darkest neighbor
		pixel = vec4(minimum, minimum, minimum, 1.0);
	}


	if (intensity == 1.0) gl_FragColor = pixel; //just output the value
		
	if (intensity == 0.0) gl_FragColor = texture2D(colorMap, vUv); //output original
	
	if (between(intensity,0.0, 1.0)){ // mix with original
		lowp vec4 front = texture2D(colorMap, vUv);
		gl_FragColor = mix(front, pixel, intensity);
	}
	

}