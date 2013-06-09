var squint = require( 'squint' )
  , fs = require( 'fs' )
  , join = require( 'path' ).join
  , command = 0
  , source = __dirname;
  
var app = { 
    execute: function() {
    app.printHelp(); 
  }, 
  executeCommand: function() {
  
    console.log( 'executing command on: ' + source );
  
    fs.stat( source, function( err, stat ) {
      
      var processFile = function( path ) {
          console.log( 'processing file ' + path ); 
          fs.readFile( path, function( err, data ) {
            if (err) throw err;
            data = command( data.toString() );
            fs.writeFile( path, data );
          } );
        }
        , processDirectory = function( path ) {
          console.log( 'processing path ' + path ); 
          fs.readdir( path, function( err, files ) {
            if (err) throw err;
            files.forEach( function( file ) {
              file = join( path, file );
              fs.stat( file, function( err, stat ) {
                if (err) throw err;
                if (stat && stat.isDirectory()) {
                  processDirectory( file );
                }
                else {
                  processFile( file );
                }
              } );
            } );
          } );
        };
      
      if (err) throw err;
      if (!stat.isDirectory()) {
        processFile( source );
      }
      else {
        processDirectory( source );
      }
    } );
  },
  cleanup: function() { 
    console.log( 'see ya' ); 
  },
  printHelp: function() {
    console.log( '\nUsage: node squint [command]' ); 
    console.log( '\nOptions:\n  -s, --strip      remove comments\n' );
  },
  parseArgs: function( args, done ) {
  
    var counter = args.length
      , decCounter = function() {
          if (!-counter) {
            done();
          }
        };

    if (!counter) {
      done();
      return;
    }
    args.forEach( function( arg ) { 
      switch (arg) {
        case '-h': case '--help':
          app.printHelp(); 
          process.exit( 0 ); 
          break;
        case '-s': case '--strip':
          command = function( code ) {
            code = squint.stripIncludes( code );
            code = squint.stripDefines( code );
            code = squint.stripComments( code );
            return code;
          };
          app.execute = app.executeCommand;
          break;
        default:
          source = arg;
          break;
      }
      decCounter();
    } ); 
  },
};

process.on( 'SIGINT', app.cleanup ); 
app.parseArgs( process.argv.slice(2) ); 
app.execute(); 
