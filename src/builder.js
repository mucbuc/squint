var assert = require( 'assert' );

function Builder(emitter) {


	emitter.on( 'open namespace', function( name ) { 
		emitter.once( 'close namespace', function( code ) { 
			emitter.emit( 'define namespace', { 'name': name, 'code': code } );
		} );
	} );

	emitter.on( 'open type', function( name ) { 
		emitter.once( 'close type', function( code ) {
			emitter.emit( 'define type', { 'name': name, 'code': code } );
		} );
	} ); 

	emitter.on( 'open function', function( name ) {
		emitter.once( 'close function', function( code ) {
			emitter.emit( 'define function', { 'name': name, 'code': code } ); 
		} );
	} );
}

exports.Builder = Builder;