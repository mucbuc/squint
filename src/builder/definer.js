var Type = new require( './type' ).Type;

function Definer( emitter ) {

  var builder = new Type( emitter )
    , name = '';

  emitter.on( 'type definition', function( code ) {
    name = code;
    emitter.once( 'close', function( code ) {
      console.log( name + ':=' + code );
    } );
  } );
}

module.exports.Definer = Definer;

/* 
  var members = [];
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
*/ 


/*
var name = ''
    , members = [];

  emitter.once( 'open', function() {
    emitter.on( 'statement', appendMember ); 
  } ); 

  emitter.once( 'close', function() {
    emitter.removeListener( 'statement', appendMember ); 
  } );

  emitter.on( 'type declaration', function( code ) {
    name = code;
  } );
  
  this.buildProduct = function( factory, done ) {

    var result = name + factory.declareOpen();
    
    if (!members.length) {
      close();
    }
    else {
      members.forEach( function( member, index ) {
        result += member + factory.memberDeclare();
        if (index == members.length - 1) {
          close();
        }
      } );
    }

    function close() {
      done( result + factory.declareClose() );
    }
  };

  function appendMember(code) {
    members.push( code.trim() );
  }*/

