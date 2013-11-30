var assert = require( 'assert' )
  , Document = require( './document' ).Document;

assert( typeof Document !== 'undefined' );

function Builder(emitter) {

	var doc = new Document();

	emitter.on( 'open namespace', function( name ) { 
		emitter.once( 'close namespace', function( code ) { 
			doc.pushNamespace( name, code );
		} );
	} );

	emitter.on( 'open type', function( signature ) { 
		emitter.once( 'close type', function( code ) {
			doc.pushType( signature, code );
		} );
	} ); 

	emitter.on( 'open function', function( signature ) {
		emitter.once( 'close function', function( code ) {
			doc.pushFunction( signature, code ); 
		} );
	} );

	this.__defineGetter__( 'document', function() {
		return doc;
	} );
}

exports.Builder = Builder;