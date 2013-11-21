/* 
*/

var assert = require( 'assert' )
  , Function = require( '../../src/builder/function' ).Function
  , Builder = require( '../base' ).Builder
  , test = Builder.test
  , expect = Builder.expect;

process.setMaxListeners( 0 );

checkFunction(); 

function checkFunction() {

	test( voidParameter );
	test( singleParameter );

	function singleParameter(emitter, parser) {
		var builder = new Function( emitter ); 
		emitter.expect( 'function signature', 'string greeting(text)' );
		parser.process( 'string greeting(text) {', emitter );
	
		emitter.expect( 'function signature', 'string greeting(text)' );
		parser.process( 'string greeting(text);', emitter );
	}

	function voidParameter(emitter, parser) {
		
		var builder = new Function( emitter ); 
		emitter.expect( 'function signature', 'string greeting()' );
		parser.process( 'string greeting() {', emitter );		

		emitter.expect( 'function signature', 'string greeting()' );
		parser.process( 'string greeting();', emitter );		
	}
}