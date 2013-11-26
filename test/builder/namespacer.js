#!/usr/bin/env node

var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , test = Builder.test
	, Namespacer = require( '../../src/builder/namespacer' ).Namespacer;

assert( typeof Namespacer !== 'undefined' );

test( checkNamespaces );
test( checkNonNamespaces );

function checkNonNamespaces(emitter, parser) {
	var builder = new Namespacer( emitter ); 
	
	emitter.on( 'namespace declare', function() { 
		assert( false );
	} );

	parser.process( 'struct bla{};', emitter );
}

function checkNamespaces(emitter, parser) {
		var builder = new Namespacer( emitter ); 
		emitter.expect( 'namespace declare', 'bla' );
		parser.process( 'namespace bla {}', emitter );
}
