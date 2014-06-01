var assert = require( 'assert' )
  , events = require( 'events' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , Tokenizer = require( 'mucbuc-jsthree' ).Tokenizer
  , finalLog = Test.finalLog;

var Base = {
  test: function( f, AnalyzerType, initTokenizer, initAnalyzer ) {
      assert(typeof AnalyzerType === 'function' );
      var emitter = new Test.Emitter()
        , parser = new Tokenizer(emitter, initTokenizer )
        , analyzer = new AnalyzerType(emitter, initAnalyzer );

      emitter.setMaxListeners( 0 );

      emitter.once( 'end', function() {
        console.log( f.name + ' passed' );
      } );

	    f( emitter, parser );
	  }
};

exports.Base = Base;
