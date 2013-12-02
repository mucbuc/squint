var assert = require( 'assert' ); 

function Builder(emitter, factory) {

	var product;
	
	this.init = function() {
		product = {
			namespaces: {}, 
			types: {}, 
			functions: {}
		}; 
	}; 

	this.init();

	this.__defineGetter__( 'product', function() { 
		return product; 
	} );

	this.__defineSetter__( 'product', function( p ) { 
		product = p;
	} ); 

	emitter.on( 'define namespace', function( scope ) {
		appendScope( product.namespaces, scope ); 
	} ); 

	emitter.on( 'define type', function( scope ) {
		appendScope( product.types, scope ); 
	} );

	emitter.on( 'define function', function( scope ) {
		appendScope( product.functions, scope ); 
	} );

	emitter.on( 'declare function', function( name ) {
		appendScope( product.functions, { name: name } );
	} );

	emitter.on( 'declare type', function( name ) {
		appendScope( product.types, { name: name } );
	} );

	function appendScope( obj, scope ) {
		if (!obj.hasOwnProperty(scope.code))
			obj[scope.name] = '';
		obj[scope.name] += scope.code;
	}
}

exports.Builder = Builder;