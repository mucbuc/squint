#!/usr/bin/env node

var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , test = Builder.test
	, Namespacer = require( '../../src/builder/namespacer' ).Namespacer;

assert( typeof Namespacer !== 'undefined' );

test( checkNamespacer );

function checkNamespacer(emitter, parser) {
		var builder = new Namespacer( emitter ); 
		emitter.expect( 'namespace declare', 'bla' );
		parser.process( 'namespace bla {}', emitter );
}