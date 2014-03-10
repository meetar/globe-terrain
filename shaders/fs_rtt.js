
// ?
precision mediump float;

uniform lowp sampler2D colorMap;
uniform lowp sampler2D valueMap;
uniform vec2 u_textureSize;
uniform vec2 u_offset;
varying vec2 vUv;
		
void main (void) {

vec4 maxPixel = texture2D(valueMap, vec2(1.0, 1.0));
float maxValue = maxPixel.r;

	// pixel = current pixel
	vec4 pixel = texture2D(colorMap, vUv);
	// just use r value, assuming monochrome image
	float value = pixel.r;
	
	// divide value by the maximum value to normalize
	value /= maxValue;
	value -= u_offset.x;
	//gl_FragColor = vec4(value, value, value, 1.0);
	gl_FragColor = vec4(value, value, value, 1.0);

}