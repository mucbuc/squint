var assert = require( 'assert' )
  , squint = require( 'squint' )

preProDirectives();
comments();

function preProDirectives() {

  var strip = squint.stripPreProDirectives;

  // single lines
  assert.equal( strip( '#include' ), '' );
  assert.equal( strip( '#include\n' ), '' );
  assert.equal( strip( '#include "text.h"' ), '' );
  assert.equal( strip( '#include "text.h"\n' ), '' );

  // multiple lines  
  assert.equal( strip( '#define text \\ntext' ), '' );
  assert.equal( strip( '#define text \\ntext\n' ), '' );
  assert.equal( strip( '#define text \\ntext\\ntext' ), '' );
  assert.equal( strip( '#define text \\ntext\\ntext\n' ), '' );
  assert.equal( strip( '#define text \	\ntext\ \ntext' ), '' );
  assert.equal( strip( '#define text \ 	\ntext\ \ntext		\n' ), '' );
}

function comments() {

  var strip = squint.stripComments;

  assert.equal( strip( '/ text' ), '/ text' );
  assert.equal( strip( 'text' ), 'text' );
  assert.equal( strip( '/ * text; * /' ), '/ * text; * /' );
  assert.equal( strip( '/* text; * /' ), '/* text; * /' );
  assert.equal( strip( '/ * text; */' ), '/ * text; */' );

  assert.equal( squint.stripComments( '// text \n' ), '' );
  assert.equal( squint.stripComments( '// text \n\n' ), '\n' );
  assert.equal( squint.stripComments( '// text \ntext // text\n' ), 'text ' );
  assert.equal( squint.stripComments( '// text ' ), '' );
  assert.equal( squint.stripComments( '// text \ntext // text' ), 'text ' );
  
  assert.equal( squint.stripComments( '/* text */' ), '' ); 
  assert.equal( squint.stripComments( '/* text */text /*text*/' ), 'text ' ); 
}