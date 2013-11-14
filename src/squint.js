var commentSingle = new RegExp( '\/\/.*\n?', 'g' )
  , commentMultiple = new RegExp( '\/\\*.*?\\*\/', 'mg' )
  , include = new RegExp( '#.*include.*\n?', 'g' )
  , defineNewLine = new RegExp( '\\\\[ \t]*\n', 'mg' )
  , define = new RegExp( '#.*define.*\s*\n?', 'g' )
  , undefine = new RegExp( '#.*undef.*\n?', 'mg' )
  , stringLiteral = new RegExp( '".*?([^\\\\]")', 'g' )
  , arrayInitBlock = RegExp( '\\s*=.*?;', 'g' );
  
module.exports.stripArrayInitializerBlocks = function( code ) {
  code = code.replace( arrayInitBlock, ';' );
  return code;
};
  
module.exports.stripStrings = function( code ) { 
  code = code.replace( stringLiteral, '' );
  return code;
};

module.exports.stripDefines = function( code ) {
  code = code.replace( defineNewLine, '' );
  code = code.replace( define, '' );
  code = code.replace( undefine, '' );
  return code;
};

module.exports.stripIncludes = function( code ) {
  code = code.replace( include, '' );
  return code;
}; 

module.exports.stripComments = function( code ) {
  code = code.replace( commentSingle, '' );
  code = code.replace( commentMultiple, '' );
  return code;
};


	