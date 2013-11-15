var assert = require( 'assert' )
  , Parser = require( '../src/parser' ).Parser
  , makeEmitTester = require( './tester' ).makeEmitTester;

makeEmitTester( Parser.prototype );

module.exports = { 
  run : function() {
  
    testDeliminator();
    testNested();
    testInterleaved();
    testScopes();
    testStatments();

  //  regularExpressions();
  //  preProcess();
    // functionParameters();
    // 
    // 
    // 
  
  }, 
};

function regularExpressions() {


}

function preProcess() {
  //var parser = new Parser( '#': '

}

function testStatments() {
  var parser = new Parser();

  parser.expect( 'statement', '1' );
  parser.expect( 'statement', '2' );
  parser.expect( 'statement', '3' );
  parser.expect( 'statement' );
 
  parser.process( '1; 2; 3;;' );

  process.on( 'exit', function() {
    console.log( 'testStatments passed' );
  } );
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

  process.on( 'exit', function() {
    console.log( 'testScopes passed' );
  } );
}

function testInterleaved() { 
  var parser = new Parser();
  
  parser.expect( 'open', 'a' );
  parser.expect( 'statement','b' );
  parser.expect( 'close' );
   
  parser.process( 'a{ b; }' );

  process.on( 'exit', function() {
    console.log( 'testInterleaved passed' );
  } );
}

function testNested() {
  var parser = new Parser();

  parser.expect( 'open', 'a' );
  parser.expect( 'open', 'b' );
  parser.expect( 'statement', 'c' );
  parser.expect( 'close' );
  parser.expect( 'close' );

  parser.process( 'a { b { c; } }' );

  process.on( 'exit', function() {
    console.log( 'testNested passed' );
  } );
}

function testDeliminator() {
  var parser = new Parser();
  
  parser.expect( 'statement', 'a' ); 
  parser.process( 'a;' );
  
  parser.expect( 'statement', 'a' ); 
  parser.process( 'a ;' );

  parser.expect( 'statement', 'a' ); 
  parser.process( ' a;' );

  parser.expect( 'statement', 'a' ); 
  parser.process( ' a ;' );

  parser.expect( 'open', 'a' ); 
  parser.process( 'a {' );

  parser.expect( 'open', 'a' ); 
  parser.process( 'a{' );

  parser.expect( 'open', 'a' ); 
  parser.process( ' a {' );

  parser.expect( 'open', 'a' ); 
  parser.process( ' a{' );

  process.on( 'exit', function() {
    console.log( 'testDeliminator passed' );
  } );
}
