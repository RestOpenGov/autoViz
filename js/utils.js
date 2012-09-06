function getDefaultValues(){
	return {
		marca : "",
		anio : 2012
	}
}


function getRandomNumber(){
	return Math.floor(Math.random()*100000);
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
