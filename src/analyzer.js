var Parser = require( './parser' ).Parser
  , events = require( 'events' );

function Analyzer( parser ) {

  var instance = this;
  events.EventEmitter.call( this );

  parser.once( 'open', function( code ) {

    var isFunction = false;

    code = processTemplateParameters( code );
    code = processFunctionSignature( code );
    if (!isFunction) { 
      instance.emit( 'type declaration', code.trim() );
    }
        
    function processTemplateParameters() {
      var parser = new Parser( { 
            '<': 'open template', 
            '>': 'close template',
            '(': 'open function'
          } )
        , signature = ''
        , depth = 0;
        
      parser.once( 'open function', function( code ) {
        if (!signature.length) {
          processFunctionSignature();
        }
        else {
          signature += code + '(';
        }

        parser.removeAllListeners();
      } );

      parser.on( 'open template', function( code ) {

        signature += code + '<';
        ++depth;
      } );
    
      parser.on( 'close template', function( code ) { 
        signature += code + '>';
        if (!--depth) {
          instance.emit( 'template parameters', signature );
          signature = '';
        }
      } );

      return parser.process( code );
    }
    
    function processFunctionSignature( sign ) {
      var parser = new Parser( { 
            '(': 'open function', 
            ')': 'close function'
          } )
        , signature = sign == undefined ? '' : sign
        , depth = sign == undefined ? 0 : 1;
      
      parser.once( 'open function', function( code ) {
        isFunction = true;
        signature += code + '(';
        ++depth;
      } );
    
      parser.once( 'close function', function( code ) { 
        signature += code + ')';
        if (!--depth) {
          instance.emit( 'function signature', signature );
          signature = '';
        }

        parser.removeAllListeners();
      } );
      
      return parser.process( code );
    }
    
  } );
}

Analyzer.prototype = new events.EventEmitter(); 

module.exports.Analyzer = Analyzer; 
