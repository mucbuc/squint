var assert = require( 'assert' )
  , events = require( 'events' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog
  , Parser = require( '../src/parser' ).Parser
  , Factory = require( '../src/factory' ).Factory;

var Builder = {
  test: function( f ) {
      var emitter = new Test.Emitter()
        , parser = new Parser(); 
      
      emitter.once( 'end', function() {
        console.log( f.name + ' passed' );
      } );

	    f( emitter, parser );
	 },
	expect: function( builder, code, emitter ) { 
		emitter.on( 'end', function() {
      var checked = false;
      
      process.nextTick( function() {
        builder.buildProduct( new Factory(), function( result ) {
          assert.equal( result, code );
          checked = true;
        } ); 
        
        process.once( 'exit', function() {
          assert.equal( checked, true );
        } );
      } );
    } );
	}
};

exports.Builder = Builder;