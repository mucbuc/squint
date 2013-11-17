var assert = require( 'assert' )
  , events = require( 'events' );

var Tester = {

  makeEmitTester: function ( emitter ) {
      var expectations = [];

      if (typeof emitter === 'undefined') {
        emitter = new events.EventEmitter();
      }
      
      process.on( 'exit', function() {
        if (expectations.length) {
          console.log( 'expected events did not occur' );
          console.log( expectations );
        }

        assert.equal( expectations.length, 0 );
      } );

      emitter.expect = function( event, code ) {
        if (!expectations.length) {
          emitter.once( event, check );
        }
        expectations.push( { event: event, code: code } );
      }; 

      function check( code ) {
        var expectation = expectations[0];
        expectations.splice( 0, 1 );
       
        if (expectation.code != undefined) {
          assert.deepEqual( code.trim(), expectation.code.trim() );
        }
        
        if (expectations.length) {
          emitter.once( expectations[0].event, check );
        }
      }
      
      return emitter;
    }, 
  testLog: function( msg ) {
      process.on( 'exit', function() {
        console.log( msg );
      } );
    }
};

module.exports = Tester; 
