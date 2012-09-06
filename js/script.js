	var ge,
	kmlTemplate,
	kmlResuelto,
	kmlObject,
	initialized=false,
	consulta;
	

	loader(true);

	log('jQuery: cargando...');
	log('Google Earth: cargando...');

	google.load("earth", "1");

	$(document).ready(function(){
		log('jQuery COMPLETO');
	});
	


	function initilize(){
		log('Google Earth: COMPLETO');
		log('KML template: cargando...');
		
		
		AutoViz = AutoViz.init({
			resourceUrl : 'docs/kml/provincias_argentina.kml'
		});

	}

	function initCB(instance) {

		log('Renderizando mapa...');

		ge = instance;

		ge.getWindow().setVisibility(true);
		ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
		
		kmlObject = ge.parseKml(kmlResuelto);
		ge.getFeatures().appendChild(kmlObject);
		
		ge.getOptions().setFlyToSpeed(0.4);

		var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
		
		lookAt.setLatitude(-34.62);
		lookAt.setLongitude(-58.44);
		lookAt.setRange(lookAt.getRange()/4);
		lookAt.setTilt(50);
		ge.getView().setAbstractView(lookAt);
		
		
		var placemarks = ge.getElementsByType('KmlPlacemark');
		for (var j = 0; j < placemarks.getLength(); ++j) {

			var placemark = placemarks.item(j);

			placemark.setStyleSelector(ge.createStyle(''));

			var placemarkS = placemark.getStyleSelector().getPolyStyle();

			// placemark.setDescription('New label');
			placemarkS.getColor().set('50'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6));

		}
		

		  

		var lineStyle = polygonPlacemark.getStyleSelector().getLineStyle();
		lineStyle.setWidth(5);
		lineStyle.getColor().set('9900ffff');
		
		
		initialized=true;

		log('Render COMPLETO');

		loader(false);
	}

	function failureCB(errorCode) { 
		console.error(errorCode)
	}

	function init() {
		google.earth.createInstance('map', initCB, failureCB);					

	}

	function visualize(){
		init();
	}



google.setOnLoadCallback(initilize);


