#!/usr/bin/env node

var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , test = Builder.test
	, Namespacer = require( '../../src/builder/namespacer' ).Namespacer;

assert( typeof Namespacer !== 'undefined' );

test( namespaces );
test( anonymousNamespaces );
test( nonNamespaces );
test( nestedNamespaces );
test( nestedAggregate ); 

function nestedAggregate( emitter, parser ) { 
	var builder = new Namespacer( emitter );
	emitter.expect( 'namespace declare', ['outside'] );
	emitter.expect( 'namespace declare', ['outside', 'inside1'] );
	emitter.expect( 'namespace declare', ['outside', 'inside2'] );
	parser.process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
}

function nestedNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expect( 'namespace declare', ['hello'] );
	emitter.expect( 'namespace declare', ['hello', 'world'] );
	emitter.expect( 'namespace declare', ['hello', 'world', ''] );
	parser.process( 'namespace hello{ namespace world{ namespace { } } }', emitter );
}

function nonNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	
	emitter.on( 'namespace declare', function() { 
		assert( false );
	} );

	parser.process( 'struct bla{};', emitter );
}

function anonymousNamespaces(emitter, parser) {
		var builder = new Namespacer( emitter ); 
		emitter.expect( 'namespace declare', [''] );
		parser.process( 'namespace {}', emitter );
}

function namespaces(emitter, parser) {
		var builder = new Namespacer( emitter ); 
		emitter.expect( 'namespace declare', ['bla'] );
		parser.process( 'namespace bla {}', emitter );
}
