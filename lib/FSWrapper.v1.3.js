///////////////////////////////////////////////////////////////////////////////
// FILESYSTEM API WRAPPER
// Jordi Moraleda
//
function FSWrapper(a,b) {
  var self = this;
  self.folderPrefix = "AppFiles/" + applicationParameters.docFolderName;

  self.init = function(doneCallback, errCallback){
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, doneCallback, errCallback);
  };

  if(typeof a == "function") setTimeout(a,10); // Temp compatibility
  else if(typeof b == "function") setTimeout(b,10)

  return this;
}

// READ A FILE
FSWrapper.prototype.read = function(filename, callback) {

  this.init(function(rootEntry) {
    rootEntry.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });

  function fail(e) {
    if(typeof callback == "function")
      callback(null, {error: e});
  }

  function gotFileEntry(fileEntry) {

    fileEntry.file(function (rFile) {
      var reader = new FileReader();

      reader.onerror = fail;

      reader.onloadend = function (evt) {
        if(typeof callback == "function")
          callback(evt.target.result, evt.target.error);
      }
      reader.readAsText(rFile);
    }, fail);
  }
};

// WRITE TO A FILE
FSWrapper.prototype.write = function(filename, content, callback) {

  this.init(function(rootEntry) {
    rootEntry.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });

  function fail(e) {
    if(typeof callback == "function")
      callback(null, {error: e});
  }

  function gotFileEntry(fileEntry) {
    fileEntry.createWriter(gotFileWriter, fail);
  }

  function gotFileWriter(fw) {
    fw.onerror = fail;
    fw.onwriteend = function (evt) {
      if(typeof callback == "function")
        callback(evt);
    }
    fw.write(content);
  }
};

// REMOVE A FILE (OR AN EMPTY FOLDER)
FSWrapper.prototype.remove = function(filename, callback) {

  this.init(function(rootEntry) {
    rootEntry.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });

  function fail(e) {
    if(typeof callback == "function")
      callback(null, {error: e});
  }

  function gotFileEntry(fileEntry) {
    fileEntry.remove(callback, fail); 
  }
};

// REMOVE A FOLDER
FSWrapper.prototype.removeDirectory = function(folderName, callback) {

  this.init(function(rootEntry) {
    rootEntry.getFile(folderName, {create: true, exclusive: false}, gotDirectoryEntry, fail);
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });

  function fail(e) {
    if(typeof callback == "function")
      callback(null, {error: e});
  }

  function gotDirectoryEntry(directoryEntry) {
    directoryEntry.removeRecursively(callback, fail);
  }
};

// GET A FILE ENTRY
FSWrapper.prototype.getFile = function(filename, callback) {

  this.init(function(rootEntry) {
    rootEntry.getFile(filename, {create: true, exclusive: false}, gotFileEntry, fail);
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });

  function fail(e) {
    if(typeof callback == "function")
      callback(null, {error: e});
  }

  function gotFileEntry(fileEntry) {
    if(typeof callback == "function")
      callback(fileEntry);
  }
};

// GET (OR CREATE) A FOLDER
FSWrapper.prototype.getDirectory = function(dirname, callback) {

  this.init(function(rootEntry) {
    rootEntry.getFile(dirname, {create: true, exclusive: false}, gotDirectoryEntry, fail);
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });

  function fail(e) {
    if(typeof callback == "function")
      callback(null, {error: e});
  }

  function gotDirectoryEntry(dirEntry) {
    if(typeof callback == "function")
      callback(dirEntry);
  }
};

// CREATE A FOLDER
FSWrapper.prototype.createDirectory = function(dirname, callback) {

  var self = this;
  var dirs = dirname.split("/").reverse();

  this.init(function(rootEntry) {
    self.rootEntry = rootEntry;
    createDir(dirs.pop());
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });
  
  function createDir(dir){
    self.rootEntry.getDirectory(dir, {
      create : true,
      exclusive : false
    }, gotDirectoryEntry, fail);
  }
  
  function gotDirectoryEntry(dirEntry){
    root = dirEntry;
    if(dirs.length > 0){ // continuar
      createDir(dirs.pop());
    } else { // Done
      if(typeof callback == "function")
        callback(dirEntry);
    }
  }
  
  function fail(e){
    if(typeof callback == "function")
      callback(null, {error: e});
  }
};

// LIST THE CONTENTS OF A FOLDER
FSWrapper.prototype.listDirectory = function(dirname, callback) {

  this.init(function(rootEntry) {
    rootEntry.getFile(dirname, {create: true, exclusive: false}, gotDirectoryEntry, fail);
  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });

  function fail(e) {
    if(typeof callback == "function")
      callback(null, {error: e});
  }

  function gotDirectoryEntry(dirEntry) {

    var dirReader = dirEntry.createReader();

    dirReader.readEntries (function(results) {
      if(typeof callback == "function")
        callback(results);
    }, fail);
  }
};

FSWrapper.prototype.download = function(url, filePath, callback){

  this.init(function(rootEntry) {
    
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);

    var target = rootEntry.toURL() + filePath;

    fileTransfer.download(uri, target,
        function(entry) {
            callback(entry);
        },
        function(error) {
            callback(null, error);
        },
        applicationParameters.acceptAllSSL,
        { }
    );

  }, function(err){
    if(typeof callback == "function")
      callback(null, {error: err});
  });
};
