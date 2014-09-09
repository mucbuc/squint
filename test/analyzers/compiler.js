#!/usr/bin/env node

var assert = require( 'chai' ).assert
  , Compiler = require( '../../src/analyzers/compiler' ).Compiler
  , Expector = require( 'expector' ).Expector;

assert( typeof Compiler === 'function' );

suite( 'compiler', function(){

	var emitter;

	setup(function() {
	    emitter = new Expector;
	    emitter.setMaxListeners( 0 );
	});
	
	teardown(function() {
		emitter.check(); 
		delete emitter;
	}); 
	
	test( 'compilerSingelDeclaration', function() {
		emitter.expect( 'declare type', 'struct hello' );
		split( 'struct hello;' );  
	});

	test( 'namespaceTreeCompiler', function() {
	  emitter.expect( 'define namespace', { name: 'namespace outside', code: ' namespace inside {} ' } );
	  emitter.expect( 'end' ); 

	  emitter.once( 'define namespace', function( context ) {
			emitter.once( 'end', function() {
				emitter.expect( 'define namespace', { name: ' namespace inside ', code: '' } ); 
				emitter.expect( 'end' );

				split( context.code );
			} ); 
	  } );

	  split( 'namespace outside{ namespace inside {} }' );
	}); 

	test( 'namespaceDeclaration', function() {
		emitter.expect( 'define namespace', { name: 'namespace outside', code: ' struct hello; ' } );
		emitter.expect( 'end' ); 

		emitter.once( 'define namespace', function( context ) {
			emitter.once( 'end', function() {
				emitter.expect( 'declare type', 'struct hello' );
				split( context.code );
			} ); 
		} ); 

		split( 'namespace outside{ struct hello; }' );
	});

	test( 'compilerNestedNamespaces', function() {
		emitter.expect( 'define namespace', { name: 'namespace outside ', code: ' namespace inside {} ' } );
		emitter.once( 'define namespace', function( context ) {
			emitter.once( 'end', function() {
				emitter.expect( 'define namespace', { name: ' namespace inside ', code: '' } );
				split( context.code );
			} ); 
		} ); 
		
		split( 'namespace outside { namespace inside {} }' );  
	});

	test( 'compilerDeclarationsAndDefinitions', function() {
		//emitter.expect( 'statement' );
		emitter.expect( 'declare type', 'struct hello' ); 
	  	split( 'struct hello;' );

		emitter.expect( 'define type', { name: 'struct hello', code: '' } ); 
		split( 'struct hello{};' );
	});

	test( 'compilerNestedTypes', function() {
		
		emitter.expect( 'define type', { name: 'struct outside ', code: ' struct inside {}; ' } );

		emitter.once( 'define type', function( context ) {
			emitter.once( 'define type', function( context ) {
				emitter.expect( 'define type', { name: ' struct inside ', code: '' } );
				split( context.code );
			} ); 
			split( context.code );
		} ); 	

	  split( 'struct outside { struct inside {}; };');
	});

	test( 'compilerFunctionDeclare', function() {
		emitter.expect( 'declare function', 'void foo()' );
		split( 'void foo();' );
	});

	test( 'compilerFunctonDefine', function() {
		emitter.expect( 'define function', { name: 'void foo() ', code: ' hello ' } ); 
		split( 'void foo() { hello }' );
	});

	test( 'compilerMemberFunctionDeclare', function() {
  	emitter.expect( 'define type' ); 
		emitter.once( 'define type', function( context ) {
			emitter.expect( 'declare function', 'void member()' ); 
			split( context.code ); 
		} ); 

		split( 'struct text{void member();};' );
	}); 

	test( 'declareTypeAfterPreproesorDirective', function() {
		emitter.expect( 'preprocess' );
		emitter.expect( 'declare type', 'struct bla' );
		split( '#define hello asd\nstruct bla;' );
	});

	test( 'declareTypeAfterPreproesorDirectives', function() {
	 	emitter.expect( 'preprocess' );
	 	emitter.expect( 'declare type', 'struct bla' );
		split( '#define hello asd\n#define hello\\nasdfasd\nstruct bla;' );
	});

	test( 'defineTypeAfterDeclareType', function () {
		emitter.expect( 'declare type', ' struct jimmy ' ); 
		emitter.expect( 'define type', { name: ' struct hey ', code: ' joe ' } )
		split( 'struct jimmy; struct hey { joe }' );
	});

	function split( code ) {
	    var compiler = new Compiler( emitter );
	    compiler.split( code ); 
	}

});
