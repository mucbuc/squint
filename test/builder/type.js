var assert = require( 'assert' )
  , events = require( 'events' )
  , Type = require( '../../src/builder/type' ).Type
  , Test = require( 'mucbuc-jsthree' ).Test
  , Builder = require( '../base' ).Builder
  , test = Builder.test;

process.setMaxListeners( 0 );

checkType(); 

function checkType() {

	test( doNotDefineType );
	test( defineType );
	test( declareType );
	test( declareTemplateType );
	test( defineTemplateType );
	test( defineNotDeclare );
	test( implementation );
	test( declarationAfterDefinition );
	test( definitionAfterDeclaration );
	test( defineMultipleTypes );
	test( declareMultipleTypes );
	test( doNotDeclareType ); 

	function doNotDeclareType( emitter, parser ) { 
		var builder = new Type( emitter );
		emitter.expectNot( 'declare type' );
		parser.process( 'text text();', emitter );
	}

	function declareMultipleTypes( emitter, parser ) {
		var builder = new Type( emitter );
		emitter.expect( 'declare type', 'text text' );
		emitter.expect( 'declare type', 'text text' );
		parser.process( 'text text; text text;', emitter );
	}

	function defineMultipleTypes( emitter, parser ) {
		var builder = new Type( emitter );
		emitter.expect( 'define type', 'text text' );
		emitter.expect( 'define type', 'text text' );
		parser.process( 'text text{}; text text{};', emitter );
	}

	function definitionAfterDeclaration(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'declare type', 'text text' );
		parser.process( 'text text;', emitter );

		emitter.expect( 'define type', 'text text' );
		parser.process( 'text text {};', emitter );
	}

	function declarationAfterDefinition(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'define type', 'text text' );
		parser.process( 'text text {};', emitter );
	
		emitter.expect( 'declare type', 'text text' );
		parser.process( 'text text;', emitter );
	}

	function implementation(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'define type', 'text text' );
		emitter.expect( 'type implementation', 'abc' );
		parser.process( 'text text {abc};', emitter );

		emitter.expect( 'define type', 'text text' );
		emitter.expect( 'type implementation', 'void abc()' );
		parser.process( 'text text { void abc() };', emitter );

		emitter.expect( 'define type', 'text text' );
		emitter.expect( 'type implementation', 'void abc();' );
		parser.process( 'text text { void abc(); };', emitter );
	}

	function defineNotDeclare(emitter, parser) {
		var emitter = new Test.Emitter
		  , builder = new Type( emitter );
		emitter.expectNot( 'declare type' );
		emitter.expect( 'define type', 'struct dummy' );
		parser.process( 'struct dummy{};', emitter );
	}

	function defineTemplateType(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'template parameters', 'class T' );
		emitter.expect( 'define type', 'template<class T> text text' );
		parser.process( 'template<class T> text text {};', emitter );
	}

	function declareTemplateType(emitter, parser) {
		var builder = new Type( emitter );
		emitter.expect( 'template parameters', 'class T' );
		emitter.expect( 'declare type', 'template<class T> text text' );
		parser.process( 'template<class T> text text;', emitter );
	}

	function declareType(emitter, parser) {
		var builder = new Type( emitter ); 
		emitter.expect( 'declare type', 'text text' );
		parser.process( 'text text;', emitter );		
	}

	function defineType(emitter, parser) {
		var builder = new Type( emitter ); 
		emitter.expect( 'define type', 'text text' );
		parser.process( 'text text {};', emitter );

		emitter.expect( 'define type', 'text text' );
		parser.process( 'text text {;};', emitter );

		emitter.expect( 'define type', 'text text' );
		parser.process( 'text text {{}};', emitter );

		emitter.expect( 'define type', 'text text' );
		parser.process( 'text text {{};};', emitter );
	}

	function doNotDefineType(emitter, parser) {
		var sub = new events.EventEmitter()
		  , builder = new Type( sub )
		  , failed = false
		  , name = doNotDefineType.name;
		
		sub.on( 'define type', function() { 
			failed = true;
			console.log( name + ' failed' );
			assert( false );
		} ); 

		process.on( 'exit', function() {
			if (!failed) {
				console.log( name + ' passed' );
			}
		} );

		parser.process( 'text text{', sub );
		parser.process( 'text text{;', sub );
		parser.process( 'text text{;}', sub );
		parser.process( 'text text{{};}', sub );
		parser.process( 'text text{{}}', sub );
	}
}
