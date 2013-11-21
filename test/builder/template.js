/* 



*/

var assert = require( 'assert' )
  , Template = require( '../../src/builder/template' ).Template
  , Builder = require( '../base' ).Builder
  , test = Builder.test;

process.setMaxListeners( 0 );

checkTemplate(); 

function checkTemplate() {

	test( singleParameter );
	test( multipleParameters );
	test( macroParameters );

	function macroParameters(emitter, parser) {
		
		var builder = new Template( emitter ); 
		emitter.expect( 'template parameters', 'MACRO(), MACRO' );
		parser.process( 'template< MACRO(), MACRO >;', emitter );		
	}

	function multipleParameters(emitter, parser) {

		var builder = new Template( emitter ); 
		emitter.expect( 'template parameters', 'class A, class B' );
		parser.process( 'template< class A, class B>;', emitter );

		emitter.expect( 'template parameters', 'class A, class B' );
		parser.process( 'template< class A, class B>{', emitter );

		emitter.expect( 'template parameters', 'class A, class B' );
		parser.process( 'template< class A, class B> text;', emitter );

		emitter.expect( 'template parameters', 'class A, class B' );
		parser.process( 'template< class A, class B> text{', emitter );

		emitter.expect( 'template parameters', 'class A, class B' );
		parser.process( 'template< class A, class B> void text( A a );', emitter );

		emitter.expect( 'template parameters', 'class A, class B' );
		parser.process( 'template< class A, class B> void text( A a ) {', emitter );	
	}

	function singleParameter(emitter, parser) {

	    var builder = new Template( emitter ); 
	    emitter.expect( 'template parameters', 'class A' );
	  	parser.process( 'template<class A>{', emitter );
	
		emitter.expect( 'template parameters', 'class A' );
 		parser.process( 'template<class A>;', emitter );

	    emitter.expect( 'template parameters', 'class A' );
	  	parser.process( 'template<class A> text text {', emitter );
	
		emitter.expect( 'template parameters', 'class A' );
 		parser.process( 'template<class A> text text;', emitter );
	
		emitter.expect( 'template parameters', 'class A' );
		parser.process( 'template<class A> void text( A a ) {', emitter );	

		emitter.expect( 'template parameters', 'class A' );
		parser.process( 'template<class A> void text( A a );', emitter );
	}
}