var assert = require( 'assert' )
  , Parser = require( '../src/parser' ).Parser
  , Test = require( 'mucbuc-jsthree' ).Test
  , TestEmitter = Test.Emitter;

process.setMaxListeners( 0 );

checkParser();

function checkParser() {

  var emitter = new TestEmitter();

  test( deliminator );
  test( nested );
  test( interleaved );
  test( scopes );
  test( statments );
  test( end );
  test( empty );
  test( falseEnd );
  test( statementEnd );
  test( eventMap );

  function eventMap( emitter ) {
    var parser = new Parser( emitter, { '<': 'open template', '>': 'close template' } );
    emitter.expect( 'open template', 'text' ); 
    emitter.expect( 'close template', 'A' );
    parser.process( 'text<A>' );
  }

  function statementEnd( emitter, parser ) {
    var counter = 0;
    emitter.expect( 'statement', '' );
    emitter.expect( 'end', '' );
    
    emitter.once( 'end', function() { 
      assert( !counter ); 
      ++counter;
    } );
    parser.process( ';' );
  }

  function falseEnd( emitter, parser ) {
    emitter.expect( 'open', '' );
    emitter.expect( 'end', '' );
    parser.process( '{' );
  }

  function empty( emitter, parser ) {
    emitter.expect( 'end', '' );
    parser.process( '' );
  }

  function end( emitter, parser ) {
    emitter.expect( 'end', 'a' );
    parser.process( ';a' );
  }

  function statments( emitter, parser ) {
    
    emitter.expect( 'statement', '1' );
    emitter.expect( 'statement', '2' );
    emitter.expect( 'statement', '3' );
    emitter.expect( 'statement' );
   
    parser.process( '1; 2; 3;;' );    
  }

  function scopes( emitter, parser ) {
        
    emitter.expect( 'open', 'a' ); 
    emitter.expect( 'close' );
    emitter.expect( 'open', 'b' );
    emitter.expect( 'close' );
    emitter.expect( 'open', 'c' );
    emitter.expect( 'close' );
   
    parser.process( 'a{} b{} c{}' );    
  }

  function interleaved( emitter, parser ) { 
        
    emitter.expect( 'open', 'a' );
    emitter.expect( 'statement','b' );
    emitter.expect( 'close' );
     
    parser.process( 'a{ b; }' );    
  }

  function nested( emitter, parser ) {
    
    emitter.expect( 'open', 'a' );
    emitter.expect( 'open', 'b' );
    emitter.expect( 'statement', 'c' );
    emitter.expect( 'close' );
    emitter.expect( 'close' );

    parser.process( 'a { b { c; } }' );    
  }

  function deliminator( emitter, parser ) {
        
    emitter.expect( 'statement', 'a' ); 
    parser.process( 'a;' );
    
    emitter.expect( 'statement', 'a' ); 
    parser.process( 'a ;' );

    emitter.expect( 'statement', 'a' ); 
    parser.process( ' a;' );

    emitter.expect( 'statement', 'a' ); 
    parser.process( ' a ;' );

    emitter.expect( 'open', 'a' ); 
    parser.process( 'a {' );

    emitter.expect( 'open', 'a' ); 
    parser.process( 'a{' );

    emitter.expect( 'open', 'a' ); 
    parser.process( ' a {' );

    emitter.expect( 'open', 'a' ); 
    parser.process( ' a{' );    
  }

  function test( f ) { 
    process.on( 'exit', function() { 
      console.log( f.name + ' passed' );
    } );
    
    f( emitter, new Parser( emitter ) );
  }
}