var Parser = require( './parser' ).Parser
  , events = require( 'events' );

function Analyzer( parser ) {

  var instance = this;
  events.EventEmitter.call( this );

  parser.once( 'open', function( code ) {

    var sub = new Parser( {
          '<': 'open template',
          '(': 'open function'
        } );
    
    sub.once( 'end', function() {
      sub.removeAllListeners();
      delete sub;
    } );
    sub.once( 'open function', processFunctionSignature );
    sub.once( 'open template', processTemplateParameters );
    sub.process( code );

    function processTemplateParameters() {
      var sub = new Parser( { 
          '<': 'open template', 
          '>': 'close template'
        } )
      , signature = ''
      , depth = 0;

      sub.on( 'open template', function( code ) {
        signature += code + '<';
        depth++;
      } );
    
      sub.on( 'close template', function( code ) { 
        signature += code + '>';
        if (!--depth) {
          instance.emit( 'template parameters', signature );
        }
      } );

      sub.once( 'end', function() {
        process.nextTick( function() {
          instance.emit( 'type declaration', code );
        } );

        sub.removeAllListeners();
      delete sub;
      } );

      sub.process( code );
    }

    function processFunctionSignature() {
      var sub = new Parser( { 
            '(': 'open function', 
            ')': 'close function'
          } )
        , signature = ''
        , depth = 0;

      sub.on( 'open function', function( code ) {
        signature += code + '(';
        ++depth;
      } );
    
      sub.on( 'close function', function( code ) { 
        signature += code + ')';
        if (!--depth) {
          instance.emit( 'function signature', signature );
        }
      } );

      sub.once( 'end', function() {
        sub.removeAllListeners();
      delete sub;
      } );

      sub.process( code );
    }

  });
}

Analyzer.prototype = new events.EventEmitter(); 

module.exports.Analyzer = Analyzer; 
