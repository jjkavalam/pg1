window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
var fs = null;

function errorHandler(e) {
  var msg = '';
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('File system error :'+msg);
}

function initFS() {
  window.requestFileSystem(window.PERSISTENT, 1024*1024, function(filesystem) {
    fs = filesystem;
  }, errorHandler);
}
 
// Initiate filesystem on page load.
if (window.requestFileSystem) {
  initFS();
}​
 
   //   Wait for device API libraries to load
   // 

    function gotFS(fileSystem) {
         fs.root.getFile(cordova.file.dataDirectory+"myfile", {create: true, exclusive: false}, gotFileEntry, errorHandler);        
    }

    function gotFileEntry(fileEntry) {
        fileEntry.file(gotFile, fail);
    }

    function gotFile(file){
        //readDataUrl(file);
        readAsText(file);
    }

    function readDataUrl(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as data URL");
            console.log(evt.target.result);
        };
        reader.readAsDataURL(file);
    }

    function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as text");
            console.log(evt.target.result);
        };
        reader.readAsText(file);
    }


    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            console.log("contents of file now 'some sample text'");
            writer.truncate(11);
            writer.onwriteend = function(evt) {
                console.log("contents of file now 'some sample'");
                writer.seek(4);
                writer.write(" different text");
                writer.onwriteend = function(evt){
                    console.log("contents of file now 'some different text'");
                }
            };
        };
        writer.write("some sample text");
    }
    
    function fail(error) {
        console.log(error.code);
    }

    //---------------
    var DataService = function(){        

}
DataService.prototype.FilesystemErrorHandler = function(e) {
  var msg = '';
  console.log(e);
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };
  console.log('File system error :'+msg);
}


    DataService.prototype.initialize = function(){
        // get the file system object and keep
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;        
        
        if (window.requestFileSystem) {
          window.requestFileSystem(window.PERSISTENT, 1024*1024, function(filesystem) {DataService.prototype.fs = filesystem;}, DataService.prototype.FilesystemErrorHandler); 
          }
        }
    
    DataService.prototype.updateUserData = function(userdata){
        var deferred = $.Deferred();

        userdata = JSON.stringify(userdata);
        
        DataService.prototype.writeFile(DataService.prototype.fs, 'userdata', userdata).then(
            function(){
                deferred.resolve();
            },
            function(error){
                console.log('updateUserData filed');
                console.log(error);
                deferred.reject();
            }
        );
        
        return deferred.promise();        
    }
    
    DataService.prototype.updateContent = function(content){
    }
    
    DataService.prototype.getUserData = function(){
        var deferred = $.Deferred();
        console.log(DataService.prototype.fs);
        DataService.prototype.readFile(DataService.prototype.fs, 'userdata', false).then(
            function(contents){
                deferred.resolve(JSON.parse(contents));
            },
            function(error){
                console.log('getUserData failed');
                console.log(error);
                deferred.reject();
            }        
        );        
        return deferred.promise();                
    }
    DataService.prototype.getContent = function(){
    }
    
DataService.prototype.fs;

//   Wait for device API libraries to load
DataService.prototype.readFile = function(fs, filename, asDataUrl){
    var deferred = $.Deferred();
    fs.root.getFile(
        cordova.file.dataDirectory+filename, 
        {create: true, exclusive: false}, 
        function(fileEntry){
            fileEntry.file(
                function(file){
                
                    var readDataUrl = function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            return evt.target.result;
                        };
                        reader.readAsDataURL(file);
                    }

                    var readAsText = function(file) {
                        var reader = new FileReader();
                        reader.onloadend = function(evt) {
                            return evt.target.result;
                        };
                        reader.readAsText(file);
                    }
                
                    var contents;
                    if (asDataUrl == undefined || asDataUrl == false){
                        contents = readAsText(file);
                    } else {
                        contents = readDataUrl(file);
                    }
                    deferred.resolve(contents);
                }, 
                function(error){
                    console.log('****');
                    deferred.reject(error);
                }
            );
        }, 
        function(error){
            console.log('$$$$$$');
            deferred.reject(error);
        }
    );        
    return deferred.promise();
}

DataService.prototype.writeFile = function(fs, filename, contents){
    var deferred = $.Deferred();
    fs.root.getFile(
        cordova.file.dataDirectory+filename, 
        {create: true, exclusive: false}, 
        function(fileEntry){
            fileEntry.createWriter(
                function(writer){
                    writer.onwriteend = function(evt) {
                        writer.write(contents);
                        writer.onwriteend = function(evt) {
                            deferred.resolve();
                        };
                    };
                    writer.truncate(0);                                            
                },
                function(error){
                    deferred.reject(error);
                }                
            );
        }, 
        function(error){
            deferred.reject(error);
        }
    );        
    
    return deferred.promise();    
}

