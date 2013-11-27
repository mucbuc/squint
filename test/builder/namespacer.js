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
	emitter.expect( 'namespace open', 'outside' );
	emitter.expect( 'namespace open', 'inside1' );
	emitter.expect( 'namespace close' );
	emitter.expect( 'namespace open', 'inside2' );
	emitter.expect( 'namespace close' );
	emitter.expect( 'namespace close' );
	parser.process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
}

function nestedNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expect( 'namespace open', 'hello' );
	emitter.expect( 'namespace open', 'world' );
	emitter.expect( 'namespace open', '' );
	emitter.expect( 'namespace close' );
	emitter.expect( 'namespace close' );
	emitter.expect( 'namespace close' );
	parser.process( 'namespace hello{ namespace world{ namespace { } } }', emitter );
}

function nonNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expectNot( 'namespace open' );
	emitter.expectNot( 'namespace close' );
	parser.process( 'struct bla{};', emitter );
}

function anonymousNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expect( 'namespace open', '' );
	emitter.expect( 'namespace close' );
	parser.process( 'namespace {}', emitter );
}

function namespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expect( 'namespace open', 'bla' );
	emitter.expect( 'namespace close' );
	parser.process( 'namespace bla {}', emitter );
}
