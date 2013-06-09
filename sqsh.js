var squint = require( 'squint' )
  , fs = require( 'fs' )
  , join = require( 'path' ).join
  , extname = require( 'path' ).extname
  , basename = require( 'path' ).basename
  , command = 0
  , commandName = ''
  , pathArguments = []
  , execute = function() {
      console.log( '\n    squint is a still very rough C++ source code tool. www.github/mucbuc' );
      console.log( '  USAGE:' );
      console.log( '    node sqsh [command] file ... ' ); 
      console.log( '  COMMANDS:' );
      console.log( '    strip -> strip comments, includes, defines, undefs, and string literals\n' );
    }
  , isValidFile = function( file ) {
      var ext = extname( file );
      return   ext == '.h'
            || ext == '.hxx'
            || ext == '.cpp'
            || ext == '.cxx';
    }
  , isValidDirectory = function( dir ) {
      var base = basename( dir );
      return base[0] != '.';
    };
  
var app = { 
  processPathArgument: function( arg ) {
    console.log( 'squint$ execute on argument: ' + arg );
  
    fs.stat( arg, function( err, stat ) {
      
      var processFile = function( path ) {
          console.log( 'squint$ ' + commandName + ' file: ' + path ); 
          fs.readFile( path, function( err, data ) {
            if (err) throw err;
            data = command( data.toString() );
            fs.writeFile( path, data );
          } );
        }
        , processDirectory = function( path ) {
          fs.readdir( path, function( err, files ) {
            if (err) throw err;
            files.forEach( function( file ) {
              file = join( path, file );
              fs.stat( file, function( err, stat ) {
                if (err) throw err;
                if (stat.isDirectory()) {
                  if (!isValidDirectory(path)) return;
                  processDirectory( file );
                }
                else if (isValidFile(file)) {
                  processFile( file );
                }
              } );
            } );
          } );
        };
      
      if (err) throw err;
      if (!stat.isDirectory()) {
        processFile( arg );
      }
      else {
        processDirectory( arg );
      }
    } );
  },
  cleanup: function() {
    console.log( 'squint$ ' );
  },
  parseArgs: function( args ) {
  
    var counter = args.length
      , decCounter = function() {
          if (!--counter) {
            execute();
          }
        };

    if (!counter) {
      execute();
      return;
    }
    args.forEach( function( arg ) { 
      switch (arg) {
        case '-h': case '--help':
          execute(); 
          process.exit( 0 ); 
          break;
        case 'strip':
          commandName = arg;
          command = function( code ) {
            code = squint.stripStrings( code );
            code = squint.stripIncludes( code );
            code = squint.stripDefines( code );
            code = squint.stripComments( code );
            return code;
          };
          execute = function() {
            if (!pathArguments.length) {
              pathArguments.push( __dirname );
            }
            console.log( 'squint$ ' + commandName );
            pathArguments.forEach( app.processPathArgument );
          };
          break;
        default:
          pathArguments.push( arg );
          break;
      }
      decCounter();
    } ); 
  },
};

process.on( 'exit', app.cleanup );
app.parseArgs( process.argv.slice(2) );
