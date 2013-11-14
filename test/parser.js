var assert = require( 'assert' )
  , Parser = require( '../src/parser' ).Parser
  , makeEmitTester = require( './tester' ).makeEmitTester;

makeEmitTester( Parser.prototype );

module.exports = { 
  run : function() {
  
    regularExpressions();
  
    //preProcess();
  
    basicTest();
    functionParameters();
    testNested();
    testInterleaved();
    testScopes();
    testStatments();
  }, 
};

function regularExpressions() {


}

function preProcess() {
  //var parser = new Parser( '#': '

}

function basicTest() {
  var parser = new Parser();
  
  parser.expect( 'statement', 'a' ); 
  parser.process( 'a;' );
  
  parser.expect( 'open', 'a' ); 
  parser.process( 'a {' );
}

function testNested() {
  var parser = new Parser();

  parser.expect( 'open', 'a' );
  parser.expect( 'open', 'b' );
  parser.expect( 'statement', 'c' );
  parser.expect( 'close' );
  parser.expect( 'close' );

  parser.process( 'a { b { c; } }' );
};

function testInterleaved() { 
  var parser = new Parser();
  
  parser.expect( 'open', 'a' );
  parser.expect( 'statement','b' );
  parser.expect( 'close' );
   
  parser.process( 'a{ b; }' );
}

function testScopes() {
  var parser = new Parser();
  
  parser.expect( 'open', 'a' ); 
  parser.expect( 'close' );
  parser.expect( 'open', 'b' );
  parser.expect( 'close' );
  parser.expect( 'open', 'c' );
  parser.expect( 'close' );
 
  parser.process( 'a{} b{} c{}' );
}

function testStatments() {
  var parser = new Parser();

  parser.expect( 'statement', '1' );
  parser.expect( 'statement', '2' );
  parser.expect( 'statement', '3' );
  parser.expect( 'statement' );
 
  parser.process( '1; 2; 3;;' );
}
