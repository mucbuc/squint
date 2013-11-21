function Forwarder( emitter ) {

  var types = [];

  emitter.on( 'open', function(code) {
    emitter.once( 'close', function() {
      
    } );

  } ); 

  emitter.on( 'end', append );

  
    // process.nextTick( function() {
    //   if (types.length) {
    //     emitter.emit( 'forward declare', types.join( ';' )  );
    //   }
    // } );
  
  function append( code ) {

    console.log( 'append', code );

    types.push( code );
  }
}

module.exports.Forwarder = Forwarder;