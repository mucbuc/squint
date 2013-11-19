var assert = require( 'assert' )
  , Parser = require( '../src/parser' ).Parser
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog
  , TestEmitter = Test.Emitter;

checkParser();

function checkParser() {
  testDeliminator();
  testNested();
  testInterleaved();
  testScopes();
  testStatments();
}

function testStatments() {
  var parser = new Parser()
    , emitter = new TestEmitter();

  emitter.expect( 'statement', '1' );
  emitter.expect( 'statement', '2' );
  emitter.expect( 'statement', '3' );
  emitter.expect( 'statement' );
 
  parser.process( '1; 2; 3;;', emitter );

  finalLog( 'testStatments passed' );
}

function testScopes() {
  var parser = new Parser()
    , emitter = new TestEmitter();
  
  emitter.expect( 'open', 'a' ); 
  emitter.expect( 'close' );
  emitter.expect( 'open', 'b' );
  emitter.expect( 'close' );
  emitter.expect( 'open', 'c' );
  emitter.expect( 'close' );
 
  parser.process( 'a{} b{} c{}', emitter );

  finalLog( 'testScopes passed' );
}

function testInterleaved() { 
  var parser = new Parser()
    , emitter = new TestEmitter();
  
  emitter.expect( 'open', 'a' );
  emitter.expect( 'statement','b' );
  emitter.expect( 'close' );
   
  parser.process( 'a{ b; }', emitter );

  finalLog( 'testInterleaved passed' );
}

function testNested() {
  var parser = new Parser()
    , emitter = new TestEmitter();

  emitter.expect( 'open', 'a' );
  emitter.expect( 'open', 'b' );
  emitter.expect( 'statement', 'c' );
  emitter.expect( 'close' );
  emitter.expect( 'close' );

  parser.process( 'a { b { c; } }', emitter );

  finalLog( 'testNested passed' );
}

function testDeliminator() {
  var parser = new Parser()
    , emitter = new TestEmitter();
  
  emitter.expect( 'statement', 'a' ); 
  parser.process( 'a;', emitter );
  
  emitter.expect( 'statement', 'a' ); 
  parser.process( 'a ;', emitter );

  emitter.expect( 'statement', 'a' ); 
  parser.process( ' a;', emitter );

  emitter.expect( 'statement', 'a' ); 
  parser.process( ' a ;', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( 'a {', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( 'a{', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( ' a {', emitter );

  emitter.expect( 'open', 'a' ); 
  parser.process( ' a{', emitter );

  finalLog( 'testDeliminator passed' );
}
