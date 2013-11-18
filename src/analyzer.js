/*
  events emitted:
    template parameters
    function signature
    type declaration
*/ 

var Parser = require( './parser' ).Parser
  , EventEmitter = require( 'events' ).EventEmitter;

function Analyzer( e ) {

  var base;

  Parser.call( this );

  base = this.process;

  this.process = function( code, e ) {

    e.once( 'open', function( code ) {

      var pos = code.search( /[<(]/ );
      if (pos == -1) {
        process.nextTick( function() {
          e.emit( 'type declaration', code );
        } );
      } 
      else if (code[pos] == '<') {
        processTemplateParameters();
      }
      else {
        processFunctionSignature();
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
    } );

    base( code, e );
  };

}

Analyzer.prototype = new Parser();

module.exports.Analyzer = Analyzer; 
