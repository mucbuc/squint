var assert = new require( 'assert' )
  , Type = new require( './type' ).Type;

function Declarer( emitter ) {
  
  var builder = new Type( emitter )
    , types = [];

  emitter.on( 'type declaration', appendType );
  emitter.on( 'type definition', appendType );

  emitter.on( 'end', function() {
    if (types.length) {
      emitter.emit( 'type decalartions', types );
      types = [];
    }
  });

  function appendType(code) {
    types.push( code );
  }
}

module.exports.Declarer = Declarer;
