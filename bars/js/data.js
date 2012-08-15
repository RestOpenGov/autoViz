function Data() {
}

Data.prototype = (function() {

    var _anio,_marca,_restOpenGov;

    var _reset = function() {
        _anio = '';
        _marca = '';
        _restOpenGov = new RestOpenGov({dataSource:'test'});
        _instance = {};
    };

    var _queryElastic = function(){
        
        consulta = {anio:_anio,marca:_marca};
        
        _restOpenGov.search({ dataset: 'autos-'+_anio, query:'' }, _processResults);

    };

    var _processResults = function(res){

        var procesado = {  
            label: [],  
            values: []
        };

        var obj;
        $.each(res,function(i,e){

            if(procesado.label.length==0){
                procesado.label = (_marca=='')?_getMarcasNames(e._source):[_marca];
            }

            if(  e._source.PROVINCIA!='TOTAL' ){

                obj = {  
                  'label': e._source.PROVINCIA,  
                  'values': _getMarcasValues(e._source)
                };

                procesado.values.push(obj);
            };
        });

        var event = jQuery.Event("retrieveInfoComplete");
        event.results = procesado;
        $(_instance).trigger(event);

    };

    var _getMarcasValues = function(marcas){
        var resp = [];
        if(_marca==''){
            $.each(marcas,function(i,e){
                if( i!='PROVINCIA' && i!='TOTAL' ){
                    resp.push(e);
                }
            });
        }else{
            resp.push(marcas[_marca]);   
        }
        return resp;
    };

    var _getMarcasNames = function(marcas){
        var resp = [];
        $.each(marcas,function(i,e){
            if( i!='PROVINCIA' && i!='TOTAL' ){
                resp.push(i);
            }
        });
        return resp;
    };

    return {

        constructor:Data,

        retrieveInfo: function(anio, marca) {
            _reset();
            _anio = anio;
            _marca = marca;
            _instance = this;

        	_queryElastic();
       	}

    };
})();
