var assert = require( 'assert' )
  , Base = require( '../base' ).Base
  , Template = require( '../../src/analyzers/template' ).Template;

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

		emitter.expect( 'template parameters', 'MACRO(), MACRO' );
		parser.process( 'template< MACRO(), MACRO >', emitter );			
	
		emitter.expect( 'template parameters', 'MACRO(ARG), MACRO()' );
		parser.process( 'template< MACRO(ARG), MACRO() >;', emitter );		
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

	function test(f) {
		Base.test( f, Template );
	}	
}