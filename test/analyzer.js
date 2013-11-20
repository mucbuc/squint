var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter
  , Parser = require( '../src/parser' ).Parser 
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog;

process.setMaxListeners( 0 );

checkAnalyzer();

function checkAnalyzer() {

  var parser = new Analyzer();

  test( typeDeclaration );
  test( functionSignatures );
  test( typeTemplateDeclaration );
  test( templatesAsFunctionParameters );
  test( templateParameters );
  test( functionLikeMacrosAsTemplateParameter );
  test( functionLikeMacrosAsTemplateParameter2 );
  test( functionLikeMacrosAsTemplateParameter3 );
  test( functionLikeMacrosAsTemplateParameter4 );

  function functionLikeMacrosAsTemplateParameter( emitter, parser ) {
    emitter.expect( 'open', 'template class< MACRO( arg ) >' );
    emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
    parser.process( 'template class< MACRO( arg ) >{', emitter );
  }

  function functionLikeMacrosAsTemplateParameter2( emitter, parser ) {
    emitter.expect( 'open', 'template class< MACRO( arg ) > class C' );
    emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
    parser.process( 'template class< MACRO( arg ) > class C{', emitter );
  }

  function functionLikeMacrosAsTemplateParameter3( emitter, parser ) {
    emitter.expect( 'open', 'template class< MACRO( arg ), U > class C' );
    emitter.expect( 'template parameters', 'template class< MACRO( arg ), U >' );
    parser.process( 'template class< MACRO( arg ), U > class C{', emitter );
  }

  function functionLikeMacrosAsTemplateParameter4( emitter, parser ) {
    emitter.expect( 'open', 'template class< MACRO( arg ), template <class U> class > class C' );
    emitter.expect( 'template parameters', 'template class< MACRO( arg ), template <class U> class >' );
    parser.process( 'template class< MACRO( arg ), template <class U> class > class C{', emitter );
  } 

  function templateParameters( emitter, parser ) {
    emitter.expect( 'open', 'template class< arg >' );
    emitter.expect( 'template parameters', 'template class< arg >' );
    parser.process( 'template class< arg >{', emitter );
  }

  function templatesAsFunctionParameters( emitter, parser ) {
    emitter.expect( 'open', 'type foo( st< abc > )' );
    emitter.expect( 'function signature', 'type foo( st< abc > )' );
    parser.process( 'type foo( st< abc > ){', emitter );
  }

  function typeTemplateDeclaration( emitter, parser ) {
    emitter.expect( 'open', 'template<class, class> type XYZ' );
    emitter.expect( 'template parameters', 'template<class, class>' );
    emitter.expect( 'type declaration', 'type XYZ' );
    parser.process( 'template<class, class> type XYZ{', emitter );
  }

  function functionSignatures( emitter, parser ) {
    emitter.expect( 'open', 'type foo()' );
    emitter.expect( 'function result type', 'type' );
    emitter.expect( 'function name', 'foo' );
    emitter.expect( 'function signature', 'type foo()' );
    parser.process( 'type foo(){', emitter );
  }

  function typeDeclaration( emitter, parser ) {
    emitter.expect( 'open', 'type XYZ' );
    emitter.expect( 'type declaration', 'type XYZ' );
    parser.process( 'type XYZ{', emitter );
  }

  function test( f ) {

    var emitter = new Test.Emitter();

    f( emitter, parser );

    finalLog( f.name + ' passed' );
  }
}

