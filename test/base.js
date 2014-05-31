var assert = require( 'assert' )
  , events = require( 'events' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog
  , Parser = require( 'mucbuc-jsthree' ).Parser;

var Base = {
  test: function( f, Parser_Type ) {
      var emitter = new Test.Emitter()
        , parser = new ((typeof Parser_Type === 'undefined') ? Parser : Parser_Type)(emitter);
      
      emitter.setMaxListeners( 0 );

      emitter.once( 'end', function() {
        console.log( f.name + ' passed' );
      } );

      if (typeof parser.process === 'undefined') {
        var Scoper = require( '../src/analyzers/scoper' ).Scoper
          , scoper;

        scoper = new Scoper(emitter);
        parser.process = scoper.process;
        parser.step = scoper.step;
      }

	    f( emitter, parser );
	  }
};

exports.Base = Base;