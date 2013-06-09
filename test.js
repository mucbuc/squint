var assert = require( 'assert' )
  , squint = require( 'squint' )

strings();
//subScopes();
declarations();
defines();
includes();
comments();

function functionDefinitions() {
  assert.equal( squint.defineFunctions( 'text text(); text text();' ), 'text text(){} text text(){}' );
  assert.equal( squint.defineFunctions( 'text text(); text text; text text();' ), 'text text(){} text text(){}' );
  assert.equal( squint.defineFunctions( 'text text(); text text{}; text text();' ), 'text text(){} text text(){}' );
  assert.equal( squint.defineFunctions( 'text text(); text text(); text text();' ), 'text text(){} text text(){}' );
}

function strings() {
  var strip = squint.stripStrings;

  assert.equal( strip( '"text"text' ), 'text' );
  assert.equal( strip( '"text\\\"text"' ), '' );
}

function subScopes() {
  var get = squint.getSubScopes
    , strip = squint.stripSubScopes
    , source = ' a {b} c {d} e'
    , subs = get( source )
    , rem = strip( source );
  
  assert.equal( subs[0], '{b}' );
  assert.equal( subs[1], '{d}' );
  assert.equal( rem, ' a  c  e' );

  subs = get('a { b { c } }');
  assert.equal( subs[0], '{ b { c } }' );
}

function declarations() {
  var getTypes = squint.getTypeDeclares
    , getFunctions = squint.getFunctionDeclares;
  
  assert.equal( getTypes( 'int text;' ), '' );
  assert.equal( getTypes( 'int text();' ), '' );
  
  assert.equal( getTypes( 'class text;' ), 'class text;' );
  assert.equal( getTypes( 'class text {' ), '' );
  
  assert.equal( getTypes( 'class text;' ), 'class text;' );
  
  // type declares need to be stripped for getFunctions 
  assert.equal( getFunctions( 'int text();' ), 'int text();' );
  assert.equal( getFunctions( 'int text() {;' ), '' );
}

function defines() {
  var strip = squint.stripDefines;
  
  assert.equal( strip( '#define text \\ 	\n text' ), '' );
  assert.equal( strip( '#define text \ntext' ), 'text' );

  assert.equal( strip( '#define text	\ntext' ), 'text' );
  assert.equal( strip( '#define text \\\ntext' ), '' );
 
  assert.equal( strip( '#define' ), '' );
  assert.equal( strip( '#define text text' ), '' );
  
  assert.equal( strip( '# define' ), '' );
  assert.equal( strip( '#	define text text' ), '' );

  assert.equal( strip( '#define' ), '' );
  assert.equal( strip( '#define text \\n text' ), '' );
  
  assert.equal( strip( '#	define' ), '' );
  assert.equal( strip( '# define text \\n text' ), '' );
  assert.equal( strip( '#	define text \\	\n text' ), '' );
  
  assert.equal( strip( '#undef' ), '' );
  assert.equal( strip( '# undef		\n' ), '' );
  
  assert.equal( strip( '#ifdef text' ), '#ifdef text' );
  assert.equal( strip( '# ifdef text' ), '# ifdef text' );
}

function includes() {

  var strip = squint.stripIncludes;

  assert.equal( strip( '#include' ), '' );
  assert.equal( strip( '#include\n' ), '' );
  assert.equal( strip( '#include "text.h"' ), '' );
  assert.equal( strip( '#include "text.h"\n' ), '' );
  
  assert.equal( strip( '# include' ), '' );
  assert.equal( strip( '#	include\n' ), '' );
  assert.equal( strip( '# 	include "text.h"	' ), '' );
  assert.equal( strip( '#  include "text.h"	\n' ), '' );
}

function comments() {

  var strip = squint.stripComments;

  assert.equal( strip( '/ text' ), '/ text' );
  assert.equal( strip( 'text' ), 'text' );
  assert.equal( strip( '/ * text; * /' ), '/ * text; * /' );
  assert.equal( strip( '/* text; * /' ), '/* text; * /' );
  assert.equal( strip( '/ * text; */' ), '/ * text; */' );

  assert.equal( strip( '// text \n' ), '' );
  assert.equal( strip( '// text \n\n' ), '\n' );
  assert.equal( strip( '// text \ntext // text\n' ), 'text ' );
  assert.equal( strip( '// text ' ), '' );
  assert.equal( strip( '// text \ntext // text' ), 'text ' );
  
  assert.equal( strip( '/* text */' ), '' ); 
  assert.equal( strip( '/* text */text /*text*/' ), 'text ' ); 
}