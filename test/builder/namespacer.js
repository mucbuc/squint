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
	emitter.expect( 'open namespace', 'outside' );
	emitter.expect( 'open namespace', 'inside1' );
	emitter.expect( 'close namespace' );
	emitter.expect( 'open namespace', 'inside2' );
	emitter.expect( 'close namespace' );
	emitter.expect( 'close namespace' );
	parser.process( 'namespace outside{ namespace inside1 {} namespace inside2 {} }', emitter );
}

function nestedNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expect( 'open namespace', 'hello' );
	emitter.expect( 'open namespace', 'world' );
	emitter.expect( 'open namespace', '' );
	emitter.expect( 'close namespace' );
	emitter.expect( 'close namespace' );
	emitter.expect( 'close namespace' );
	parser.process( 'namespace hello{ namespace world{ namespace { } } }', emitter );
}

function nonNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expectNot( 'open namespace' );
	emitter.expectNot( 'close namespace' );
	parser.process( 'struct bla{};', emitter );
}

function anonymousNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expect( 'open namespace', '' );
	emitter.expect( 'close namespace' );
	parser.process( 'namespace {}', emitter );
}

function namespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	emitter.expect( 'open namespace', 'bla' );
	emitter.expect( 'close namespace' );
	parser.process( 'namespace bla {}', emitter );
}
