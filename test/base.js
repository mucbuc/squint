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
      
      emitter.setMaxListeners( 0 );

      emitter.once( 'end', function() {
        console.log( f.name + ' passed' );
      } );

	    f( emitter, parser );
	  }
};

exports.Builder = Builder;