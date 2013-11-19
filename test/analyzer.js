var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter
  , Parser = require( '../src/parser' ).Parser 
  , analyze = require( '../src/analyzer' ).analyze
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , analyze = require( '../src/analyzer' ).analyze
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog
  , testLog = finalLog
  , TestEmitter = Test.Emitter
  , makeTestEmitter = Test.makeEmitTester; 

 checkAnalyzer();

function checkAnalyzer() {
  typeDeclaration();
  functionSignatures();
  typeTemplateDeclaration();
  templatesAsFunctionParameters();
  templateParameters();
  functionLikeMacrosAsTemplateParameter();
  functionLikeMacrosAsTemplateParameter2();
  functionLikeMacrosAsTemplateParameter3();
  functionLikeMacrosAsTemplateParameter4();
}

function templateParameters() {

  var parser = new Parser()
    , emitter = makeTestEmitter(); 
  
  analyze( emitter );

  emitter.expect( 'open', 'template class< arg >' );
  emitter.expect( 'template parameters', 'template class< arg >' );
  parser.process( 'template class< arg >{', emitter );

  testLog( 'templateParameters passed' );
}

function functionLikeMacrosAsTemplateParameter() {

  var parser = new Parser()
    , emitter = makeTestEmitter();
  
  analyze( emitter );

  emitter.expect( 'open', 'template class< MACRO( arg ) >' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) >{', emitter );
  testLog( 'functionLikeMacrosAsTemplateParameter passed' );

}

function functionLikeMacrosAsTemplateParameter2() {

  var parser = new Parser()
    , emitter = makeTestEmitter();
  
  analyze( emitter );
  emitter.expect( 'open', 'template class< MACRO( arg ) > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) > class C{', emitter );
}

function functionLikeMacrosAsTemplateParameter3() {

  var parser = new Parser()
    , emitter = makeTestEmitter();
  
  analyze( emitter );
  emitter.expect( 'open', 'template class< MACRO( arg ), U > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ), U >' );
  parser.process( 'template class< MACRO( arg ), U > class C{', emitter );
}

function functionLikeMacrosAsTemplateParameter4() {

  var parser = new Parser()
    , emitter = makeTestEmitter();
  
  analyze( emitter );
  emitter.expect( 'open', 'template class< MACRO( arg ), template <class U> class > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ), template <class U> class >' );
  parser.process( 'template class< MACRO( arg ), template <class U> class > class C{', emitter );
} 

function templatesAsFunctionParameters() {
  var parser = new Parser()
    , emitter = makeTestEmitter();
  
  analyze( emitter );

  emitter.expect( 'open', 'type foo( st< abc > )' );
  emitter.expect( 'function signature', 'type foo( st< abc > )' );
  parser.process( 'type foo( st< abc > ){', emitter );

  testLog( 'templatesAsFunctionParameters passed' );
}

function typeTemplateDeclaration() {

  var parser = new Parser()
    , emitter = makeTestEmitter();
  
  analyze( emitter );

  emitter.expect( 'open', 'template<class, class> type XYZ' );
  emitter.expect( 'template parameters', 'template<class, class>' );
  emitter.expect( 'type declaration', 'type XYZ' );
  parser.process( 'template<class, class> type XYZ{', emitter );

  testLog( 'typeTemplateDeclaration passed' );
}

function functionSignatures() {

  var parser = new Parser()
    , emitter = makeTestEmitter();

  analyze( emitter );

  emitter.expect( 'open', 'type foo()' );
  emitter.expect( 'function signature', 'type foo()' );
  parser.process( 'type foo(){', emitter );

  testLog( 'functionSignatures passed' );
}

function typeDeclaration() {
  
  var parser = new Parser()
    , emitter = makeTestEmitter();

  analyze( emitter );

  emitter.expect( 'open', 'type XYZ' );
  emitter.expect( 'type declaration', 'type XYZ' );
  parser.process( 'type XYZ{', emitter );

  testLog( 'typeDeclaration passed' );
}

/*

function makeEmitTester( emitter ) {
      var expectations = [];

      if (typeof emitter === 'undefined') {
        emitter = new EventEmitter();
      }
      
      process.setMaxListeners( 0 );

      process.on( 'exit', function() {
        if (expectations.length) {
          console.log( 'expected events did not occur' );
          console.log( expectations );
        }

        assert.equal( expectations.length, 0 );
      } );

      emitter.expect = function( event, code ) {
        if (!expectations.length) {
          emitter.once( event, check );
        }
        expectations.push( { event: event, code: code } );
      }; 

      function check( code ) {
        var expectation = expectations[0];
        expectations.splice( 0, 1 );
       
        if (expectation.code != undefined) {
          assert.deepEqual( code.trim(), expectation.code.trim() );
        }
        
        if (expectations.length) {
          emitter.once( expectations[0].event, check );
        }
      }
      
      return emitter;
    }
    */ 
