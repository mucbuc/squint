var assert = new require( 'assert' )
  , Type = new require( './type' ).Type;

function Declarer( emitter ) {
  
  var builder = new Type( emitter )
    , types = [];

  emitter.on( 'declare type', appendType );
  emitter.on( 'define type', appendType );

  emitter.on( 'end', function() {
    if (types.length) {
      emitter.emit( 'declare types', types );
      types = [];
    }
  });

  function appendType(code) {
    types.push( code );
  }
}

module.exports.Declarer = Declarer;
