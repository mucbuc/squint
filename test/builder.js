var assert = require( 'assert' )
  , events = require( 'events' )
  , Type = require( '../src/type' ).Type
  , Builder = require( '../src/builder' ).Builder
  , Test = require( 'mucbuc-jsthree' ).Test;

assert( typeof Builder !== 'undefined' ); 

testBuilder(); 

function testBuilder() {

	var emitter = new Test.Emitter()
	  , builder = new Builder(emitter)
	  , parser = new Type()
	  , doc; 

	parser.process( 'namespace bla{ } namespace bladf { saf3r23sfsd} namespace _ { dsfs }', emitter );

	doc = builder.document;



	console.log( 'doc', doc ); 
}