#!/usr/bin/env node

var assert = require( 'assert' )
  , squint = require( '../src/squint' )
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog;

assert( typeof squint != 'undefined' );

process.setMaxListeners( 0 );

stripComments();
stripDefines();
stripIncludes();
stripArrayInitializerBlocks();
stripStrings();

function stripStrings() {
  var strip = squint.stripStrings;

  assert.equal( strip( '"text"text' ), 'text' );
  assert.equal( strip( '"text\\\"text"' ), '' );

  finalLog( 'stripStrings passed' );
}

function stripArrayInitializerBlocks() {
  var strip = squint.stripArrayInitializerBlocks;
  
  assert.equal( strip( 'int a[] = { 0, 3, 1 };' ), 'int a[];' );
  assert.equal( strip( 'int a[] = { 0, 3, 1 }; text text {};' ), 'int a[]; text text {};' );

  finalLog( 'stripArrayInitializerBlocks passed' );
}

function stripIncludes() {

  var strip = squint.stripIncludes;

  assert.equal( strip( '#include' ), '' );
  assert.equal( strip( '#include\n' ), '' );
  assert.equal( strip( '#include "text.h"' ), '' );
  assert.equal( strip( '#include "text.h"\n' ), '' );
  
  assert.equal( strip( '# include' ), '' );
  assert.equal( strip( '#	include\n' ), '' );
  assert.equal( strip( '# 	include "text.h"	' ), '' );
  assert.equal( strip( '#  include "text.h"	\n' ), '' );

  finalLog( 'stripIncludes passed' );
}

function stripDefines() {
  var strip = squint.stripDefines;
  
  assert.equal( strip( '#define text \\   \n text' ), '' );
  assert.equal( strip( '#define text \ntext' ), 'text' );

  assert.equal( strip( '#define text  \ntext' ), 'text' );
  assert.equal( strip( '#define text \\\ntext' ), '' );
 
  assert.equal( strip( '#define' ), '' );
  assert.equal( strip( '#define text text' ), '' );
  
  assert.equal( strip( '# define' ), '' );
  assert.equal( strip( '# define text text' ), '' );

  assert.equal( strip( '#define' ), '' );
  assert.equal( strip( '#define text \\n text' ), '' );
  
  assert.equal( strip( '# define' ), '' );
  assert.equal( strip( '# define text \\n text' ), '' );
  assert.equal( strip( '# define text \\  \n text' ), '' );
  
  assert.equal( strip( '#undef' ), '' );
  assert.equal( strip( '# undef   \n' ), '' );
  
  assert.equal( strip( '#ifdef text' ), '#ifdef text' );
  assert.equal( strip( '# ifdef text' ), '# ifdef text' );
  
  finalLog( 'stripDefines passed' );
}

function stripComments() {

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

  finalLog( 'stripComments passed' );
}
