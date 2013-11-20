function Definer( emitter ) {

  var declaration = ''
    , members = [];

  emitter.once( 'open', function() {
    emitter.on( 'statement', appendMember ); 
  } ); 

  emitter.once( 'close', function() {
    emitter.removeListener( 'statement', appendMember ); 
  } );

  emitter.on( 'type declaration', function( code ) {
    declaration = code;
  } );
  
  this.buildProduct = function( factory, done ) {
    
    if (!members.length) {
      done( '' );
    }
    else 
    {
      var result = ''
        , type_name = getDeclarationName(declaration);
      
      members.forEach( function( member, index ) {
        var return_type = getReturnType( member )
          , function_name = getNameAndArgs( member );

        result += return_type + ' ' + type_name + '::' + function_name + '{}'; 
        if (index == members.length - 1) {
          done( result );
        }
      } );
    }
  };

  function appendMember(code) {
    members.push( code.trim() );
  }

  // super temp super hack TODO: fix
  function getDeclarationName(dec) { 
    return dec.split(' ')[1];
  }

  function getReturnType(signature) { 
    return signature.split(' ')[0];
  }

  function getNameAndArgs(signature) { 
    var split = signature.split(' ');

    return split.slice( 1 );
  }
}

module.exports.Definer = Definer;
