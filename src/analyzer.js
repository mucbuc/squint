var Parser = require( './parser' ).Parser
  , events = require( 'events' );

function Analyzer( parser ) {

  var instance = this;
  events.EventEmitter.call( this );

  parser.once( 'open', function( code ) {

    var sub = new Parser( {
        '<': 'open template',
        '(': 'open function'
      } )
      , isType = true;

    sub.once( 'end', function() {
      if (isType) {
        instance.emit( 'type declaration', code );
      }
      delete sub;
    } );
    
    sub.once( 'open function', processFunctionSignature );
    sub.process( code );

    function processFunctionSignature( sign ) {
      var sub = new Parser( { 
            '(': 'open function', 
            ')': 'close function'
          } )
        , signature = ''
        , depth = 0;

      sub.on( 'open function', function( code ) {
        isFunction = true;
        signature += code + '(';
        ++depth;
      } );
    
      sub.on( 'close function', function( code ) { 
        signature += code + ')';
        if (!--depth) {
          instance.emit( 'function signature', signature );
          delete sub;
        }
      } );
      
      isType = false;
      return sub.process( code );
    }

  });
}

Analyzer.prototype = new events.EventEmitter(); 

module.exports.Analyzer = Analyzer; 




/*

    var isFunction = false;

    code = processTemplateParameters( code );
    code = processFunctionSignature( code );
    if (!isFunction) { 
      instance.emit( 'type declaration', code.trim() );
    }
        
    function processTemplateParameters( code ) {
      var parser = new Parser( { 
            '<': 'open template', 
            '>': 'close template',
            '(': 'open function',
          } )
        , signature = ''
        , depth = 0;
      
      parser.once( 'end', function() {
        delete parser;
      } );

      parser.once( 'open function', function( code ) {
        if (!signature.length) {
          processFunctionSignature();
        }
        else {
          
          append( code );
          
          parser.on( 'open function', append );
          
          function append( code ) {
            signature += code + '(';
          }
        }
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
      
      parser.once( 'end', function() {
        delete parser;
      } );

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
      } );
      
      return parser.process( code );
    }
    

*/ 