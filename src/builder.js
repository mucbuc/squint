var assert = require( 'assert' ); 

function Builder(emitter, factory) {

	var product = {
		namespaces: {}, 
		types: {}, 
		functions: {}
	}; 

	emitter.on( 'define namespace', function( scope ) {
		if (!product.namespaces.hasOwnProperty(scope.code))
			  product.namespaces[scope.name] = '';
		product.namespaces[scope.name] += scope.code; 
	} ); 

	emitter.on( 'define type', function( scope ) {
		console.log( 'define namespace', scope.name, scope.code );
	} );

	emitter.on( 'define function', function( scope ) {
		console.log( 'define function', scope.name, scope.code );
	} );

	this.__defineGetter__( 'product', function() { 
		return product; 
	} );
}

exports.Builder = Builder;