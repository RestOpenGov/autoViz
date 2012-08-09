	var ge,kmlTemplate,kmlResuelto,kmlObject,initialized=false,consulta;

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
		  //url: "docs/kml/lite.kml",
		  url: "docs/kml/provincias_argentina.kml",
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
		
		loader(true);

		if(!anio){
			var def = getDefaultValues();
			anio = def.anio;
			marca = def.marca;
			
		}

		consulta = {anio:anio,marca:marca};
		
		var opengov = new RestOpenGov({dataSource:'test'});
		opengov.search({ dataset: 'autos-'+anio, query:'' }, resultElastic);

	}
	
	function getRandomNumber(){
		return Math.floor(Math.random()*100000);
	}

	function resultElastic(resp){
		log('RestOpenGov: RESPUESTA');

		log('Procesando datos...');
		
		var prov,
			results = [],
			idProv,
			cant;
		$(resp).each(function(i,e){
			prov = e._source['PROVINCIA'];
			switch(prov){
				case 'TOTAL':
				break;
				case 'CAPITAL FEDERAL':
					idProv = 1;
				break;
				case 'BUENOS AIRES':
					idProv = 2;
				break;
				case 'CATAMARCA':
					idProv = 3;
				break;
				case 'CORDOBA':
					idProv = 4;
				break;
				case 'CORRIENTES':
					idProv = 5;
				break;
				case 'CHACO':
					idProv = 6;
				break;
				case 'CHUBUT':
					idProv = 7;
				break;
				case 'ENTRE RIOS':
					idProv = 8;
				break;
				case 'FORMOSA':
					idProv = 9;
				break;
				case 'JUJUY':
					idProv = 10;
				break;
				case 'LA PAMPA':
					idProv = 11;
				break;
				case 'LA RIOJA':
					idProv = 12;
				break;
				case 'MENDOZA':
					idProv = 13;
				break;
				case 'MISIONES':
					idProv = 14;
				break;
				case 'NEUQUEN':
					idProv = 15;
				break;
				case 'RIO NEGRO':
					idProv = 16;
				break;
				case 'SALTA':
					idProv = 17;
				break;				
				case 'SAN JUAN':
					idProv = 18;
				break;
				case 'SAN LUIS':
					idProv = 19;
				break;
				case 'SANTA CRUZ':
					idProv = 20;
				break;
				case 'SANTA FE':
					idProv = 21;
				break;
				case 'SANTIAGO DEL ESTERO':
					idProv = 22;
				break;
				case 'TUCUMAN':
					idProv = 23;
				break;
				case 'TIERRA DEL FUEGO':
					idProv = 24;
				break;

			}
			
			if(consulta.marca!=''){
				cant = e._source[consulta.marca];
			}else{
				cant = e._source['TOTAL'];
			}
			
			if(idProv)
				results.push({id : idProv, cant : parseInt(cant)});
		
		});
		
		/*//TODO estructura para todos
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
			];*/

		resolveTemplate(results);
	}
	
	function resolveTemplate(data){
		log('Completando template...');
		var search,msg;
		kmlResuelto = kmlTemplate;
		
		search = new RegExp('QUERY', 'gi');
		if(consulta.marca==''){
			msg = "Cantidad TOTAL en "+consulta.anio;
		} else {
			msg = "Cantidad " + consulta.marca + " en "+consulta.anio;
		}
		kmlResuelto = kmlResuelto.replace(search, msg);
		
		$.each(data, function(i, e) { 
			search = new RegExp('{P_'+e.id+'_CANT}', 'gi');
			kmlResuelto = kmlResuelto.replace(search, e.cant+" autos");
			search = new RegExp('{P_'+e.id+'}', 'gi');
			kmlResuelto = kmlResuelto.replace(search, (e.cant*50));
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