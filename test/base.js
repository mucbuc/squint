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
	expect: function( builder, code ) {
		process.on( 'exit', function() {
      builder.buildProduct( new Factory(), function( result ) {
        assert.equal( result, code );
      } ); 
    } );
	}
};

exports.Builder = Builder;