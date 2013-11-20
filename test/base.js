var assert = require( 'assert' )
  , events = require( 'events' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Factory = require( '../src/factory' ).Factory;

var Builder = {
  test: function( f ) {
	    var emitter = new events.EventEmitter()
	      , analyzer = new Analyzer()
	    f( emitter, analyzer );

	    finalLog( f.name + ' passed' );
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