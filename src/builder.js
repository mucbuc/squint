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
		if (!product.types.hasOwnProperty(scope.code))
			product.types[scope.name] = '';
		product.types[scope.name] += scope.code;
	} );

	emitter.on( 'define function', function( scope ) {
		if (!product.functions.hasOwnProperty(scope.code))
			product.functions[scope.name] = '';
		product.functions[scope.name] += scope.code;
	} );

	this.__defineGetter__( 'product', function() { 
		return product; 
	} );
}

exports.Builder = Builder;