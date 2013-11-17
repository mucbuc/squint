var Parser = require( './parser' ).Parser
  , EventEmitter = require( 'events' ).EventEmitter;

function analyze( e ) {

  e.once( 'open', function( code ) {

    var sub = new Parser( { '<': 'open template', '(': 'open function' } )
      , emitter = new EventEmitter()
      , declareType = true;
    
    emitter.once( 'open function', processFunctionSignature );
    emitter.once( 'open template', processTemplateParameters );
    emitter.once( 'end', processTypeDeclaration );
    
    sub.process( code, emitter );

    function processTypeDeclaration( end ) {
      if (declareType) {
        process.nextTick( function() {
          e.emit( 'type declaration', end );
        } );
      }
    //  emitter.removeAllListeners();
     // delete emitter;
    }

    function processTemplateParameters() {
      var sub = new Parser( { '<': 'open template', '>': 'close template' } )
        , emitter = new EventEmitter()
        , signature = ''
        , depth = 0;

      emitter.on( 'open template', function( code ) {
        signature += code + '<';
        depth++;
      } );
    
      emitter.on( 'close template', function( code ) { 
        signature += code + '>';
        if (!--depth) {
          process.nextTick( function() {
            e.emit( 'template parameters', signature );
          } );
          
          declareType = false;
          emitter.on( 'end', function( code ) {
            process.nextTick( function() {
              e.emit( 'type declaration', code );
            } );
          } );
        }
      } );

      sub.process( code, emitter );
    }

    function processFunctionSignature() {
      
      var sub = new Parser( { '(': 'open function', ')': 'close function' } )
        , emitter = new EventEmitter()
        , signature = ''
        , depth = 0;

      emitter.on( 'open function', function( code ) {
        signature += code + '(';
        ++depth;
      } );
    
      emitter.on( 'close function', function( code ) { 
        signature += code + ')';
        if (!--depth) {
          process.nextTick( function() {
            e.emit( 'function signature', signature );
          } );
        }
      } );

      declareType = false;
      sub.process( code, emitter );
    }

  });
}

module.exports.analyze = analyze; 
