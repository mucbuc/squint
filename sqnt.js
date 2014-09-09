#!/usr/bin/env node

var assert = require( 'assert' )
  , fs = require( 'fs' )
  , events = require( 'events' )
  , squint = require( './src/squint.js' );

if (process.argv.length == 3) {
	fs.readFile( process.argv[2], function(err, data) {
		
		var emitter = new events.EventEmitter()
		  , cleaned = squint.stripComments( data.toString() );
		//cleaned = squint.stripDefines( cleaned );
		//cleaned = squint.stripPreprocessor( cleaned ); 
		//cleaned = squint.stripStrings( cleaned );
		//cleaned = squint.stripTypedefs( cleaned );
		emitter.on( 'define type', print );
		emitter.on( 'declare type', print );
		emitter.on( 'declare function', print );
		emitter.on( 'define function', print );
		emitter.on( 'comment', print ); 
		emitter.on( 'preprocess', print );
		squint.analyze( cleaned, emitter );
	
		function print( context ) {
			console.log( context ); 
		}
	} );
}