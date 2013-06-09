var assert = require( 'assert' )
  , squint = require( 'squint' )

forwardDeclarations();
defines();
includes();
comments();

function forwardDeclarations() {
  var get = squint.getForwardTypeDeclares;
  
  assert.equal( get( 'int text;' ), '' );
  assert.equal( get( 'class text;' ), 'class text;' );
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