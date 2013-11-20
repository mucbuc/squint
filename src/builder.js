function Builder( emitter, factory ) {
  
  var result = '';
  
  emitter.on( 'open', function( code ) {
    result = result.concat( factory.createOpen( code ) );
  } );

  emitter.on( 'close', function( code ) {
    result = result.concat( factory.createClose( code ) );
  } );

  emitter.on( 'statement', function( code ) {
    result = result.concat( factory.createStatement( code ) );
  } );
  
  this.__defineGetter__( 'result', function() {
    return result;
  } );
}

function Forwarder( emitter ) {

  var types = [];

  emitter.on( 'type declaration', function( code ) {
    types.push( code );
  } );
  
  this.buildProduct = function( factory, done ) {
    var result = '';
    types.forEach( function( type, index ) {
      result += type + factory.memberDeclare();
    
      if (index == types.length - 1) {
        done( result );
      }
    } ); 
  };
}

function Declarer( emitter ) {

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
    members.forEach( function( member, index ) {
      result += member + factory.memberDeclare();
      if (index == members.length - 1) {
        done( result + factory.declareClose() );
      }
    } );
  };

  function appendMember(code) {
    members.push( code.trim() );
  }
}

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

module.exports.Builder = Builder;
module.exports.Forwarder = Forwarder;
module.exports.Declarer = Declarer;
module.exports.Definer = Definer;