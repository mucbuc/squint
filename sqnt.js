#!/usr/bin/env node

var assert = require( 'assert' )
  , fs = require( 'fs' )
  , squint = require( './src/squint.js' );

if (process.argv.length == 3) {
	fs.readFile( process.argv[2], function(err, data) {
		
		var cleaned = squint.stripComments( data.toString() );
		//cleaned = squint.stripDefines( cleaned );
		//cleaned = squint.stripPreprocessor( cleaned ); 
		//cleaned = squint.stripStrings( cleaned );
		//cleaned = squint.stripTypedefs( cleaned ); 
		squint.compile( cleaned, function( model ) {
  			console.log( model );
  		} );
  	} );
}