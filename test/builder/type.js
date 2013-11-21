var assert = require( 'assert' )
  , Type = require( '../../src/builder/type' ).Type
  , Builder = require( '../base' ).Builder
  , test = Builder.test
  , expect = Builder.expect;

process.setMaxListeners( 0 );

checkType(); 

function checkType() {

	test( declareEmpty );
	test( defineEmpty );
	test( declareTemplate );

	function declareTemplate(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'template parameters', 'class T' );
		emitter.expect( 'type declaration', 'template<class T> text text' );
		parser.process( 'template<class T> text text;', emitter );
	}

	function defineEmpty(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'type definition', 'text text' );
		parser.process( 'text text {', emitter );
	}

	function declareEmpty(emitter, parser) {
		var builder = new Type( emitter ); 
		emitter.expect( 'type declaration', 'text text' );
		parser.process( 'text text;', emitter );		
	}
}
