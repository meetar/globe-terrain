	var renderTargetParams = {
		minFilter:THREE.LinearFilter,
		stencilBuffer:false,
		depthBuffer:false,
	};
	

function prepRTT(myImage, vs, fs) {
		// RTT 1
		myScene = new THREE.Scene();

		imageW = myImage.image.width;
		imageH = myImage.image.height;

		// create buffers
		myTexture = new THREE.WebGLRenderTarget( imageW, imageH, renderTargetParams );				

		// custom RTT materials
		myUniforms = {
			colorMap: { type: "t", value: myImage },
			u_textureSize: { type: "v2", value: new THREE.Vector2( imageW, imageH ) },
			u_erode: { type: "f", value: 0.1 },	
			u_dilate: { type: "f", value: 0.1 },	
			u_divisor: { type: "f", value: 1.0 },
		
			// first FBO gets an extra texture, for use with fs_rtt
			valueMap: { type: "t", value: myTexture }
		};
		myTextureMat = new THREE.ShaderMaterial({
			uniforms: myUniforms,
			vertexShader: vs,
			fragmentShader: fs
		});				

		// Setup render-to-texture scene
		myCamera = new THREE.OrthographicCamera( imageW / - 2, imageW / 2, imageH / 2, imageH / - 2, -10000, 10000 );
		
		var myTextureGeo = new THREE.PlaneGeometry( imageW, imageH );
		myTextureMesh = new THREE.Mesh( myTextureGeo, myTextureMat );
		myTextureMesh.position.z = -100;
		myScene.add( myTextureMesh );

		

		// RTT 2

		myScene2 = new THREE.Scene();

		// create buffers
		myTexture2 = new THREE.WebGLRenderTarget( imageW, imageH, renderTargetParams );				
		
		// custom RTT materials
		myUniforms2 = {
			colorMap: { type: "t", value: myTexture },
			u_textureSize: { type: "v2", value: new THREE.Vector2( imageW, imageH ) },
			u_erode: { type: "f", value: 0.1 },	
			u_dilate: { type: "f", value: 0.1 },	
			u_divisor: { type: "f", value: 1.0 },
		};
		myTextureMat2 = new THREE.ShaderMaterial({
			uniforms: myUniforms2,
			vertexShader: vs,
			fragmentShader: fs
		});				

		// Setup render-to-texture scene
		myCamera2 = new THREE.OrthographicCamera( imageW / - 2, imageW / 2, imageH / 2, imageH / - 2, 1, 10000 );
		
		var myTextureGeo2 = new THREE.PlaneGeometry( imageW, imageH );
		myTextureMesh2 = new THREE.Mesh( myTextureGeo2, myTextureMat2 );
		myTextureMesh2.position.z = -100;
		myScene2.add( myTextureMesh2 );
		
		var RTT = {
			image: myImage,
			scene: myScene,
			camera: myCamera,
			texture: myTexture,
			textureMat: myTextureMat,
			scene2: myScene2,
			camera2: myCamera2,
			texture2: myTexture2,
			textureMat2: myTextureMat2
		};
		
		return RTT;
	}