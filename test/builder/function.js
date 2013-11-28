/* 
*/

var assert = require( 'assert' )
  , Function = require( '../../src/builder/function' ).Function
  , Builder = require( '../base' ).Builder
  , test = Builder.test;

process.setMaxListeners( 0 );

checkFunction(); 

function checkFunction() {

	test( voidParameter );
	test( singleParameter );
	test( declareTemplateFunction );

	function declareTemplateFunction(emitter, parser) {
		var builder = new Function( emitter ); 
		emitter.expect( 'template parameters', 'class T' );
		emitter.expect( 'declare function', 'template<class T> string greeting(T text)' );
		parser.process( 'template<class T> string greeting(T text);', emitter );
	}

	function singleParameter(emitter, parser) {
		
		var builder = new Function( emitter ); 
		emitter.expect( 'define function', 'string greeting(text)' );
		parser.process( 'string greeting(text) {', emitter );
	
		emitter.expect( 'declare function', 'string greeting(text)' );
		parser.process( 'string greeting(text);', emitter );
	}

	function voidParameter(emitter, parser) {
		
		var builder = new Function( emitter ); 
		emitter.expect( 'define function', 'string greeting()' );
		parser.process( 'string greeting() {', emitter );		

		emitter.expect( 'declare function', 'string greeting()' );
		parser.process( 'string greeting();', emitter );		
	}
}