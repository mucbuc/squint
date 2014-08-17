var assert = require( 'assert' )
  , events = require( 'events' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog
  , fluke = require( 'flukejs' );

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
	  }, 

  test_2: function(f, rules, Tokenizer ) {
      var emitter = new Test.Emitter
        , scoper = new Tokenizer( emitter );
      
      f( emitter, splitAll );
      process.on( 'exit', function() {
        console.log( f.name + ' passed' );
      });

      function splitAll( code ) {
        fluke.splitAll( code, function( type, request ) {
            emitter.emit(type, request);
          }
          , rules ); 
      }
    }
};

exports.Base = Base;
