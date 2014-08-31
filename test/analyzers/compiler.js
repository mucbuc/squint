#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Compiler = require( '../../src/analyzers/compiler' ).Compiler
  , Declarer = require( '../../src/analyzers/declarer' ).Declarer
  , Base = require( '../base' ).Base
  , Scoper = require( '../../src/analyzers/scoper' ).Scoper
  , rules = {
      'preprocess': '#',
      'comment line': '\\/\\/',
      'comment block': '\\/\\*',
      'open literal': '([^//]"|^")',
      'statement': ';',
      'open': '{',
      'close': '}'
    };

assert( typeof Compiler === 'function' );
assert( typeof Scoper === 'function' );

process.setMaxListeners( 0 );

Base.test_2( compilerSingelDeclaration, rules, Scoper );
Base.test_2( namespaceTreeCompiler, rules, Scoper );
Base.test_2( namespaceDeclaration, rules, Scoper );
Base.test_2( compilerDeclarationsAndDefinitions, rules, Scoper );
// test( compilerNestedTypes ); 
// test( compilerFunctionDeclare ); 
// test( compilerFunctonDefine );
// test( compilerMemberFunctionDeclare );
// test( declareTypeAfterPreproesorDirective ); 
// test( declareTypeAfterPreproesorDirectives ); 
// test( defineTypeAfterDeclareType );

function defineTypeAfterDeclareType( emitter, parser ) {
  emitter.expect( 'declare type', { name: 'struct jimmy', code: '' } );
  emitter.expect( 'define type', { name: 'struct hey', code: 'joe' } ); 
  parser.process( 'struct jimmy; struct hey { joe }' );
}

function declareTypeAfterPreproesorDirectives( emitter, parser ) {
 	emitter.expect( 'preprocessor' );
 	emitter.expect( 'declare type', 'struct bla' );
  parser.process( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;', emitter );
}

function declareTypeAfterPreproesorDirective( emitter, parser ) {
  emitter.expect( 'preprocessor' );
  emitter.expect( 'declare type', 'struct bla' );
	parser.process( '#define hello asd\nstruct bla;', emitter );
}

function compilerMemberFunctionDeclare(emitter, parser) {
  emitter.expect( 'define type' ); 
	emitter.once( 'define type', function( context ) {
		emitter.expect( 'declare function', 'void member()' ); 
		parser.process( context.code ); 
	} ); 

  parser.process( 'struct text{void member();};', emitter );
}

function compilerFunctonDefine(emitter, parser) {
	emitter.expect( 'define function', { name: 'void foo()', code: 'hello' } ); 
	parser.process( 'void foo() { hello }' );
}

function compilerFunctionDeclare(emitter, parser) {
	emitter.expect( 'declare function', 'void foo()' );
	parser.process( 'void foo();' );
}

function compilerNestedTypes(emitter, parser) {
    
	emitter.expect( 'define type', { name: 'struct outside', code: 'struct inside{};' } );
	emitter.once( 'define type', function( context ) {
		emitter.expect( 'define type', { name: 'struct inside', code: 'struct inside{}' } ); 
		parser.process( context.code ); 
	} ); 	

  parser.process( 'struct outside { struct inside {}; };');
}

function compilerNestedNamespaces(emitter, parser) {

	emitter.once( 'compile', function( model ) {
    var obj;
    assert.deepProperty( model, 'namespaces.namespace outside' );
    obj = model.namespaces[ 'namespace outside' ];
    assert.deepProperty( obj, 'namespaces.namespace inside' );
	} );
	
	parser.process( 'namespace outside { namespace inside {} }', emitter );  
}

function compilerDeclarationsAndDefinitions(emitter, process) {
	
	emitter.expect( 'declare type', 'struct hello' ); 
  	process( 'struct hello;' );

	// emitter.expect( 'define type', { name: 'struct hello', code: '' } ); 
	// process( 'struct hello{};' );
}

function namespaceDeclaration(emitter, process) {
	var compiler = new Compiler( emitter );

	emitter.expect( 'define namespace', { name: 'namespace outside', code: ' struct hello; ' } );
	emitter.expect( 'end' ); 

	emitter.once( 'define namespace', function( context ) {
		emitter.once( 'end', function() {
			emitter.expect( 'declare type', 'struct hello' );
			process( context.code );
		} ); 
	} ); 

	process( 'namespace outside{ struct hello; }' );
} 

function namespaceTreeCompiler(emitter, process) {
  var compiler = new Compiler( emitter );

  emitter.expect( 'define namespace', { name: 'namespace outside', code: ' namespace inside {} ' } );
  emitter.expect( 'end' ); 

  emitter.once( 'define namespace', function( context ) {
	emitter.once( 'end', function() {
		emitter.expect( 'define namespace', { name: ' namespace inside ', code: '' } ); 
		emitter.expect( 'end' );

		process( context.code );
	} ); 
  } );

  process( 'namespace outside{ namespace inside {} }' );
} 

function compilerSingelDeclaration(emitter, process) {
	var compiler = new Compiler( emitter ); 
	emitter.expect( 'statement' ); 
	emitter.expect( 'declare type', 'struct hello' );
	process( 'struct hello;' );  
}

function test(f) {
  Base.test( f, Compiler );
}
