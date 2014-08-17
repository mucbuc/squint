#!/usr/bin/env node

var assert = require( 'assert' )
  , fluke = require( 'flukejs' )
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , Definer = require( '../../src/analyzers/definer' ).Definer
  , Test = require( 'mucbuc-jsthree' ).Test
  , rules = {
      // 'preprocess': '#',
      // 'comment line': '\\/\\/',
      // 'comment block': '\\/\\*',
      //'statement': ';',
      'open': '{',
      'close': '}',
    };

assert( typeof Definer !== 'undefined' );

testNamespace();
// testType();
// testFunction();

function testFunction() {

	test( defineFunction, rules );

	function defineFunction(emitter, process) {
		
		var definer = new Definer(emitter, process);

		emitter.expectNot( 'define namespace' );
		emitter.expectNot( 'define type' );

		emitter.expect( 'define function', { name: 'void foo()', code: 'do something' } );
		process( 'void foo() { do something }' );

		emitter.expect( 'define function', { name: 'void fool()', code: 'do nothing' } );
		process( 'void fool() { do nothing }' );

		emitter.expect( 'define function', {
			name: 'hello::hello()',
			code: 'bla bla',
			meta: 'base()'
		} );
		process( 'hello::hello() : base() {bla bla}' );
	}
}

function testType() {

	test( defineType, rules );
	test( defineSubType, rules );

	function defineSubType( emitter, process ) {
		
		var definer = new Definer(emitter, process);

		emitter.expect( 'define type', { name: 'struct cya', code: 'yes', meta: 'blu' } );
		process( 'struct cya : blu { yes }' );
	}

	function defineType(emitter, process) {

		var definer = new Definer(emitter, process);

		emitter.expectNot( 'define namespace' );
		emitter.expectNot( 'define function' );

		emitter.expect( 'define type', { name: 'struct hello', code: 'unsigned world;' } );
		process( 'struct hello { unsigned world; }' );

		emitter.expect( 'define type', { name: 'struct cya', code: 'yes' } );
		process( 'struct cya { yes}' );

		emitter.expect( 'define type', { name: 'struct cya', code: 'yes' } );
		process( 'typedef hello string; struct cya { yes}' );
	}
}

function testNamespace() {

	test( defineNamespace, rules );

	function defineNamespace(emitter, process) {

		var definer = new Definer(emitter, process);

		emitter.expectNot( 'define type' );
		emitter.expectNot( 'define function' );

		emitter.expect( 'define namespace', { name: 'namespace hello', code: 'this is it' } );
		process( 'namespace hello { this is it }' );

		// emitter.expect( 'define namespace', { name: 'namespace world', code: 'wtf?' } );
		// process( 'namespace world { wtf? }' );

		// emitter.expect( 'define namespace', { name: 'namespace world', code: '' } );
		// process( 'namespace world{}' );
	}
}

function test(f, rules ) {
  var emitter = new Test.Emitter
    , scoper = new Scoper( emitter, splitNext );
  
  f( emitter, splitNext );
  process.on( 'exit', function() {
    console.log( f.name + ' passed' );
  });

  function splitNext( code ) {
    fluke.splitNext( code, function(type, lhs, rhs, token) {
        emitter.emit(type, lhs, rhs, token);
      }
      , rules ); 
  }
}
