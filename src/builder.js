var assert = require( 'assert' ); 

function Builder(emitter, factory) {

	var product = {
		namespaces: {}, 
		types: {}, 
		functions: {}
	}; 

	emitter.on( 'define namespace', function( scope ) {
		setProperty( product.namespaces, scope ); 
	} ); 

	emitter.on( 'define type', function( scope ) {
		setProperty( product.types, scope ); 
	} );

	emitter.on( 'define function', function( scope ) {
		setProperty( product.functions, scope ); 
	} );

	this.__defineGetter__( 'product', function() { 
		return product; 
	} );

	function setProperty( obj, scope ) {
		if (!obj.hasOwnProperty(scope.code))
			obj[scope.name] = '';
		obj[scope.name] += scope.code;
	}
}

exports.Builder = Builder;