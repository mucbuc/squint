var assert = require( 'assert' );

function makeEmitTester( emitter ) {
  var expectations = [];
  
  process.on( 'exit', function() {
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
      assert.deepEqual( code, expectation.code );
    }
    
    if (expectations.length) {
      emitter.once( expectations[0].event, check );
    }
  }
  
  return emitter;
};

module.exports.makeEmitTester = makeEmitTester;