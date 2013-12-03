
var assert = require( 'assert' )
  , Base = require( './base' ).Base
  , Declarer = require( '../src/declarer' ).Declarer;

assert( typeof Declarer !== 'undefined' );

testDeclarer();

function testDeclarer() {

	test( typeDeclare );
	test( declareFunction );
	test( declareNot );
	test( ignoreSubScopes );

	function ignoreSubScopes(emitter, parser) {
		emitter.expectNot( 'declare type' );
		parser.process( 'namespace { struct hello; }' );
	}

	function declareNot(emitter, parser) {
		emitter.expectNot( 'declare function' );
		parser.process( 'bla bla;' );
		parser.process( 'bla += bla();' );
	}

	function declareFunction( emitter, parser ) {
		emitter.expectNot( 'define function' );
		emitter.expect( 'declare function', 'void foo()' );
		parser.process( 'void foo();' );
	}

	function typeDeclare( emitter, parser ) {
	 	emitter.expectNot( 'define type' );
		emitter.expect( 'declare type', 'struct bla' );
		parser.process( 'struct bla;' );
	}
} 

function test(f) {
	Base.test( f, Declarer ); }