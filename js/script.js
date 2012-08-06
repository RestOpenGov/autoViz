	var ge,kmlTemplate,kmlResuelto,kmlObject,initialized=false;

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
		//Load KML template
		$.ajax({
		  //url: "lite.kml",
		  url: "docs/kml/provincias_argentina.kml",
		  cache: false,
		  dataType: 'text'
		}).done(function( kml ) {
			log('KML template: COMPLETO');
			kmlTemplate = kml;
			loader(false);
			
			//First query
			queryElastic();
		});
		
		$('#visualizar').click(function(){
			$('#map').html('');
			queryElastic($('#anio').val(), $('#marca').val());
		});

	}

	function initCB(instance) {

		log('Renderizando mapa...');

	   	ge = instance;

	   	ge.getWindow().setVisibility(true);
	   	ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);

	   	/*google.earth.fetchKml(ge, 'http://localhost/viz/autoViz/provincias_argentina.kml', function(kmlObject) {
		    if(kmlObject) {
				ge.getFeatures().appendChild(kmlObject);
			}
		});*/
		
		kmlObject = ge.parseKml(kmlResuelto);
		ge.getFeatures().appendChild(kmlObject);
		
		ge.getOptions().setFlyToSpeed(0.4);

		var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
		
		lookAt.setLatitude(-34.62);
		lookAt.setLongitude(-58.44);
		lookAt.setRange(lookAt.getRange()/4);
		lookAt.setTilt(50);
		ge.getView().setAbstractView(lookAt);
		initialized=true;

		log('Render COMPLETO');

		loader(false);
	}

	function failureCB(errorCode) { 
		console.error(errorCode)
	}

	function init() {
		//if(!initialized){
		  	google.earth.createInstance('map', initCB, failureCB);					
		/*}else{
			kmlObject = ge.parseKml(kmlTemplate);
			ge.getFeatures().appendChild(kmlObject);
			loader(false);
		}*/
	}
	
	function getDefaultValues(){
		return {
			marca : "",
			anio : 2012
		}
	}
	
	function queryElastic(anio,marca){
		log('RestOpenGov: consultando...');
		console.log(anio,marca);

		loader(true);

		if(!anio){
			var def = getDefaultValues();
			anio = def.anio;
			marca = def.marca;
		}
		//TODO query
		
		//async callback
		resultElastic();
		
	}
	
	function getRandomNumber(){
		return Math.floor(Math.random()*100000);
	}

	function resultElastic(){
		log('RestOpenGov: RESPUESTA');

		log('Procesando datos...');

		//TODO estructura para todos
		var result = 
			[
			{id : 1, cant : getRandomNumber()},
			{id : 2, cant : getRandomNumber()},
			{id : 3, cant : getRandomNumber()},
			{id : 4, cant : getRandomNumber()},
			{id : 5, cant : getRandomNumber()},
			{id : 6, cant : getRandomNumber()},
			{id : 7, cant : getRandomNumber()},
			{id : 8, cant : getRandomNumber()},
			{id : 9, cant : getRandomNumber()},
			{id : 10, cant : getRandomNumber()},
			{id : 11, cant : getRandomNumber()},
			{id : 12, cant : getRandomNumber()},
			{id : 13, cant : getRandomNumber()},
			{id : 14, cant : getRandomNumber()},
			{id : 15, cant : getRandomNumber()},
			{id : 16, cant : getRandomNumber()},
			{id : 17, cant : getRandomNumber()},
			{id : 18, cant : getRandomNumber()},
			{id : 19, cant : getRandomNumber()},
			{id : 20, cant : getRandomNumber()},
			{id : 21, cant : getRandomNumber()},
			{id : 22, cant : getRandomNumber()},
			{id : 23, cant : getRandomNumber()},
			{id : 24, cant : getRandomNumber()}
			];

		resolveTemplate(result);
	}
	
	function resolveTemplate(data){
		log('Completando template...');
		var search;
		kmlResuelto = kmlTemplate;
		$.each(data, function(i, e) { 
			search = new RegExp('P_'+e.id, 'gi');
			kmlResuelto = kmlResuelto.replace(search, e.cant);
		});		
		visualize();
		
	}
	
	function visualize(){
		init();
	}

	function loader(on){
		if(on){
			$('#log').addClass('loader');
		}else{
			$('#log').removeClass('loader');
		}
	}
	
	function log(msg){
		var t,d = new Date();
		t= d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

		$('#log').append(t+' - '+msg+'<br/>');
	}

	google.setOnLoadCallback(initilize);