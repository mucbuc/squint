var Parser = require( './parser' ).Parser
  , EventEmitter = require( 'events' ).EventEmitter;

function Analyzer( parser ) {

  var instance = this;
  
  parser.once( 'open', function( code ) {

    var sub = new Parser( {
          '<': 'open template',
          '(': 'open function'
        } )
      , emitter = new EventEmitter();
    
    emitter.once( 'end', function() {
      emitter.removeAllListeners();
      delete emitter;
    } );
    emitter.once( 'open function', processFunctionSignature );
    emitter.once( 'open template', processTemplateParameters );
    
    sub.process( code, emitter );

    function processTemplateParameters() {
      var sub = new Parser( { 
          '<': 'open template', 
          '>': 'close template'
        } )
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
          instance.emit( 'template parameters', signature );
        }
      } );

      emitter.once( 'end', function() {
        process.nextTick( function() {
          instance.emit( 'type declaration', code );
        } );

        emitter.removeAllListeners();
        delete emitter;
      } );

      sub.process( code, emitter );
    }

    function processFunctionSignature() {
      
      var sub = new Parser( { 
            '(': 'open function', 
            ')': 'close function'
          } )
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
          instance.emit( 'function signature', signature );
        }
      } );

      emitter.once( 'end', function() {
        emitter.removeAllListeners();
        delete emitter;
      } );

      sub.process( code, emitter );
    }

  });
}

module.exports.Analyzer = Analyzer; 
