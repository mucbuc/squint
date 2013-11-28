var assert = require( 'assert' )
  , Builder = require( '../base' ).Builder
  , Declarer = require( '../../src/builder/declarer' ).Declarer
  , Factory = require( '../../src/factory' ).Factory
  , test = Builder.test
  , expect = Builder.expect;

test( declareType );
test( emptyOnDeclare );

function emptyOnDeclare(emitter, parser) {
  var builder = new Declarer( emitter );
  emitter.expect( 'declare types', [ 'struct dummy' ] );
  parser.process( 'struct dummy{};', emitter );
  
  emitter.expectNot( 'declare types' );
  parser.process( '', emitter );
}

function declareType(emitter, parser) {
  var builder = new Declarer( emitter );
  emitter.expect( 'declare types', [ 'struct dummy' ] );
  parser.process( 'struct dummy{};', emitter );
  
  emitter.expect( 'declare types', [ 'struct dummy' ] );
  parser.process( 'struct dummy;', emitter );

  emitter.expect( 'declare types', [ 'struct dummy' ] );
  parser.process( 'struct dummy{ void init(); };', emitter );
}
