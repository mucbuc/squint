var assert = require( 'assert' )
  , Parser = require( '../src/parser' ).Parser
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog
  , TestEmitter = Test.Emitter

checkParser();

function checkParser() {

  var parser = new Parser()
    , emitter = new TestEmitter();

  test( deliminator );
  test( nested );
  test( interleaved );
  test( scopes );
  test( statments );
  test( end );

  function end( emitter, parser ) {
    emitter.expect( 'end', 'a' );
    parser.process( ';a', emitter );
  }

  function statments( emitter, parser ) {
    
    emitter.expect( 'statement', '1' );
    emitter.expect( 'statement', '2' );
    emitter.expect( 'statement', '3' );
    emitter.expect( 'statement' );
   
    parser.process( '1; 2; 3;;', emitter );    
  }

  function scopes( emitter, parser ) {
        
    emitter.expect( 'open', 'a' ); 
    emitter.expect( 'close' );
    emitter.expect( 'open', 'b' );
    emitter.expect( 'close' );
    emitter.expect( 'open', 'c' );
    emitter.expect( 'close' );
   
    parser.process( 'a{} b{} c{}', emitter );    
  }

  function interleaved( emitter, parser ) { 
        
    emitter.expect( 'open', 'a' );
    emitter.expect( 'statement','b' );
    emitter.expect( 'close' );
     
    parser.process( 'a{ b; }', emitter );    
  }

  function nested( emitter, parser ) {
    
    emitter.expect( 'open', 'a' );
    emitter.expect( 'open', 'b' );
    emitter.expect( 'statement', 'c' );
    emitter.expect( 'close' );
    emitter.expect( 'close' );

    parser.process( 'a { b { c; } }', emitter );    
  }

  function deliminator( emitter, parser ) {
        
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
  }

  function test( f ) { 
    f( emitter, parser );
    finalLog( f.name + ' passed' );
  }
}