/* 
objective: 
  - split code
  - map split code to events
  - pass split code to event chain

design: 
  to be used as 'constant' object. properties are attached from the map (see init function), 
  so to change the deliminators on the fly one would have to manage the properties. from a 
  higher perspective, changing the deliminators doesn't seem like a clean solution.
*/ 

function Parser( map ) {
  
  var instance = this
    , deliminators = init( typeof map === 'undefined' ? Parser.prototype.defaultMap() : map );

  this.process = function( code, emitter ) {

    var pos = code.search( deliminators );
    while (pos != -1) {
      var source = code.substr( 0, pos );
      emitter.emit( instance[ code[ pos ] ], source );
      code = code.substr( pos + 1, code.length );
      pos = code.search( deliminators );
    }
    emitter.emit( 'end', code );
  }; 
  
  function init( map ) {
    var chars = '['
      , regExs = [];
    
    for (property in map) {
      if (property.length > 1) {
        regExs.push( { property: map[property] } );
      }
      else {
        chars = chars.concat( property );
      }
      instance[property] = map[property];
    }
    return new RegExp( chars + ']' );  
  }
}; 

Parser.prototype.defaultMap = function() {
  return { 
      ';': 'statement', 
      '{': 'open', 
      '}': 'close'
  }; 
}; 

module.exports.Parser = Parser;
