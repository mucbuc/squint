var assert = require( 'assert' )
  , events = require( 'events' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog;

var Base = {
  test: function( f, AnalyzerType, ParserType, initTokenizer, initAnalyzer ) {
      assert(typeof AnalyzerType === 'function' );

      var emitter = new Test.Emitter()
        //, parser = new ParserType(emitter, initTokenizer)
        , analyzer = new AnalyzerType(emitter, initAnalyzer);

      emitter.setMaxListeners( 0 );

      emitter.once( 'end', function() {
        console.log( f.name + ' passed' );
      } );

	    f( emitter, analyzer );
	  }
};

exports.Base = Base;
