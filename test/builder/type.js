var assert = require( 'assert' )
  , events = require( 'events' )
  , Type = require( '../../src/builder/type' ).Type
  , Builder = require( '../base' ).Builder
  , test = Builder.test
  , expect = Builder.expect;

process.setMaxListeners( 0 );

checkType(); 

function checkType() {

	test( doNotDefineType );
	test( defineType );
	test( declareType );
	test( declareTemplateType );

	function declareTemplateType(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'template parameters', 'class T' );
		emitter.expect( 'type declaration', 'template<class T> text text' );
		parser.process( 'template<class T> text text;', emitter );
	}

	function declareType(emitter, parser) {
		var builder = new Type( emitter ); 
		emitter.expect( 'type declaration', 'text text' );
		parser.process( 'text text;', emitter );		
	}

	function defineType(emitter, parser) {
		var builder = new Type( emitter ); 
		emitter.expect( 'type definition', 'text text' );
		parser.process( 'text text {};', emitter );

		emitter.expect( 'type definition', 'text text' );
		parser.process( 'text text {;};', emitter );

		emitter.expect( 'type definition', 'text text' );
		parser.process( 'text text {{}};', emitter );

		emitter.expect( 'type definition', 'text text' );
		parser.process( 'text text {{};};', emitter );
	}

	function doNotDefineType(emitter, parser) {
		var sub = new events.EventEmitter()
		  , builder = new Type( sub )
		  , failed = false
		  , name = doNotDefineType.name;
		
		sub.on( 'type definition', function() { 
			failed = true;
			console.log( name + ' failed' );
			assert( false );
		} ); 

		process.on( 'exit', function() {
			if (!failed) {
				console.log( name + ' passed' );
			}
		} );

		parser.process( 'text text{', sub );
		parser.process( 'text text{;', sub );
		parser.process( 'text text{;}', sub );
		parser.process( 'text text{{};}', sub );
		parser.process( 'text text{{}}', sub );
	}
}
