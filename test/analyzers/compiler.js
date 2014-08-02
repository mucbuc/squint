#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , events = require( 'events' )
  , Compiler = require( '../../src/analyzers/compiler' ).Compiler
  , Base = require( '../base' ).Base;

assert( typeof Compiler === 'function' );

process.setMaxListeners( 0 );

test( compilerSingelDeclaration );
test( namespaceTreeCompiler );
test( namespaceDeclaration );
test( compilerDeclarationsAndDefinitions );
test( compilerNestedTypes ); 
test( compilerFunctionDeclare ); 
test( compilerFunctonDefine );
test( compilerMemberFunctionDeclare );
test( declareTypeAfterPreproesorDirective ); 
test( declareTypeAfterPreproesorDirectives ); 
test( defineTypeAfterDeclareType );

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
	}	); 	

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

function compilerDeclarationsAndDefinitions(emitter, parser) {
	
	emitter.expect( 'declare type', 'struct hello' ); 
  parser.process( 'struct hello;' );

	emitter.expect( 'define type', { name: 'struct hello', code: '' } ); 
	parser.process( 'struct hello{};' );
}

function namespaceDeclaration(emitter, parser) {
	
	emitter.expect( 'define namespace', { name: 'namespace outside', code: 'struct hello;' } );
	emitter.expect( 'end' ); 

	emitter.once( 'define namespace', function( context ) {
		emitter.expect( 'declare type', 'struct hello' );
		emitter.expect( 'end' ); 
		parser.process( context.code );
	} ); 

	parser.process( 'namespace outside{ struct hello; }' );
} 

function namespaceTreeCompiler(emitter, parser) {
  
  emitter.expect( 'define namespace', { name: 'namespace outside', code: 'namespace inside{}' } );
  emitter.expect( 'end' ); 

	emitter.once( 'define namespace', function( context ) {
		emitter.expect( 'define namespace', { name: 'namespace inside', code: '' } ); 
		emitter.expect( 'end' ); 
		
		parser.process( context.code )
	} );

  parser.process( 'namespace outside{ namespace inside {} }' );
} 

function compilerSingelDeclaration(emitter, parser) {
	emitter.expect( 'declare type', 'struct hello' );
	parser.process( 'struct hello;', emitter );  
}

function test(f) {
  Base.test( f, Compiler );
}
