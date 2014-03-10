
attribute vec4 tangent; 
attribute float amplitude;
attribute float displacement;

varying vec3 vTangent;
varying vec3 vBinormal;
varying vec3 vNormal;
varying vec2 vUv;

uniform vec2 matrightBottom;
uniform vec2 matleftTop;
uniform float sphereRadius;
uniform float mixAmount;

varying vec3 vPointLightVector;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform vec3 uPointLightPos;

#ifdef VERTEX_TEXTURES

	uniform sampler2D tDisplacement;
	uniform float uDisplacementScale;
	uniform float uDisplacementBias;
	uniform float uDisplacementPostScale;

#endif

		// convert the positions from a lat, lon to a position on a sphere.
vec3 latLongToVector3(float lat, float lon, float radius) {
		float PI = 3.1415926535897932384626433832795;
		float phi = (lat)*PI/180.0;
		// float theta = (lon-180.0)*PI/180.0; // not sure why that -180 is there
		float theta = (lon)*PI/180.0; // this makes the shader work for regular geo too
		
		float x = radius * cos(phi) * cos(theta);
		float y = radius * cos(phi) * sin(theta);
		float z = radius * sin(phi);

		// return vec3(x,y,z);
		// the above math calls Z up - 3D calls Y up
		// i don't know why it has to be negative :P
		return vec3(x,z,-y);
}

vec2 uvToLatLong(vec2 uvs, vec2 leftTop, vec2 rightBottom ) {
		// uv coordinates go from bottom-left to top-right
		// 0.0,0.0 is bottom left, 1.0,1.0 is top right, 0.5,0.5 is center
		// latLong coords go depending on which demisphere you're in
		float right = rightBottom.x;
		float bottom = rightBottom.y;
		float left = leftTop.x;
		float top = leftTop.y;

		float xDiff = right - left;
		float yDiff = bottom - top;
		
		// treat uv as a completion ratio from left to right and bottom to top
		float xPercent = left + ( xDiff * uvs.x );
		float yPercent = bottom - ( yDiff * uvs.y );
		
		vec2 latlong = vec2( xPercent, yPercent );
		return latlong;
		
		
}

void main() {

	vec2 thisUV = uv;
	// stretch the uv join a bit to reduce the gap at the seam
	if ( thisUV.x == 1.0 ) thisUV.x = 1.003;
	// convert material lat/long uniforms to cartesian coordinates
	vec2 newLatLong = uvToLatLong(thisUV, matleftTop, matrightBottom);
	// for debugging
	vec3 goalPosition = latLongToVector3(newLatLong.y, newLatLong.x, sphereRadius);
	vec3 newPosition = mix( position, goalPosition, mixAmount );
	// vec3 newPosition = latLongToVector3(newLatLong.y, newLatLong.x, sphereRadius);

	// for a sphere centered at the origin, vertex position also == normal!
	vec3 newnormal = normalize(newPosition);
	
	vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
	vViewPosition = -mvPosition.xyz;

	vNormal = normalize( normalMatrix * newnormal );

	//tangent and binormal vectors
	vTangent = normalize( normalMatrix * tangent.xyz );

	vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );
	vBinormal = normalize( vBinormal );

	vUv = thisUV;
	
	// point light
	vec4 lPosition      = viewMatrix * vec4( uPointLightPos, 1.0 );
	vPointLightVector   = normalize( lPosition.xyz - mvPosition.xyz );

	#ifdef VERTEX_TEXTURES
			vec3 dv                 = texture2D( tDisplacement, vUv ).xyz;
			float df                = uDisplacementScale * dv.x + uDisplacementBias;
			
			vec4 displacedPosition  = vec4( vNormal.xyz * df * uDisplacementPostScale/100.0, 0.0 ) + mvPosition;

			gl_Position             = projectionMatrix * displacedPosition;
	#else
		gl_Position = projectionMatrix * mvPosition;
	#endif
}
