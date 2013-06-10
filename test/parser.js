var assert = require( 'assert' )
  , Parser = require( 'parser' ).Parser;

testNested();
testInterleaved();
testScopes();
testStatments();

function testNested() {
  var parser = new TestParser();

  parser.expect( 'open', 'a' );
  parser.expect( 'open', 'b' );
  parser.expect( 'statement', 'c' );
  parser.expect( 'close' );
  parser.expect( 'close' );

  parser.process( 'a { b { c; } }' );
};

function testInterleaved() { 
  var parser = new TestParser();
  
  parser.expect( 'open', 'a' );
  parser.expect( 'statement','b' );
  parser.expect( 'close' );
   
  parser.process( 'a{ b; }' );
}

function testScopes() {
  var parser = new TestParser();
  
  parser.expect( 'open', 'a' ); 
  parser.expect( 'close' );
  parser.expect( 'open', 'b' );
  parser.expect( 'close' );
  parser.expect( 'open', 'c' );
  parser.expect( 'close' );
 
  parser.process( 'a{} b{} c{}' );
}

function testStatments() {
  var parser = new TestParser();

  parser.expect( 'statement', '1' );
  parser.expect( 'statement', '2' );
  parser.expect( 'statement', '3' );
  parser.expect( 'statement' );
 
  parser.process( '1; 2; 3;;' );
}

function TestParser() {
  var expectations = [];
  
  Parser.call( this, this );
  
  this.emit = function( event, code ) {

    var expectation = expectations[0];
    expectations.splice( 0, 1 );
    
    assert.equal( event, expectation.event );
    if (expectation.code != undefined) {
      assert.equal( code, expectation.code );
    }
  };

  this.expect = function( event, code ) {
    expectations.push( { event: event, code: code } );
  }; 
};

TestParser.prototype = new Parser();
