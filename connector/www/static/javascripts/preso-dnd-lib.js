function DNDFileController(id) {
  var el_ = document.getElementById(id);
  var thumbnails_ = document.getElementById('thumbnails');

  window.URL = window.URL ? window.URL :
               window.webkitURL ? window.webkitURL : window;

  this.dragenter = function(e) {
    e.stopPropagation();
    e.preventDefault();
    el_.classList.add('rounded');
  };

  this.dragover = function(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  this.dragleave = function(e) {
    e.stopPropagation();
    e.preventDefault();
    el_.classList.remove('rounded');
  };

  this.drop = function(e) {
    e.stopPropagation();
    e.preventDefault();

    el_.classList.remove('rounded');

    var files = e.dataTransfer.files;
    
    var reader = new FileReader();
    
    //console.log(files[0])
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render stl.
        //console.log(e.target.result.toString());
        //console.log(e.target.result.replace(/^data:base64,/, ''))
        //console.log(typeof e.target.result);
        //console.log($.base64Decode(new_string))
        //console.log(theFile.toString())
        //console.log($.base64Decode(e.target.result.replace(/^data:base64,/, '')))
        current_file_data = $.base64Decode(e.target.result.replace(/^data:base64,/, ''));
        $('#print').data('text', current_file_data);
        thingiview.loadSTLString(current_file_data);
      };
    })(files[0]);
    
    reader.readAsDataURL(files[0])
    //var text = reader.readAsText(files[0])
    //console.log(text);
    //thingiview.loadOBJString(text);
    
    
    //for (var i = 0, file; file = files[i]; i++) {
      //var imageType = /image.*/;
      /*
      if (!file.type.match(imageType)) {
        continue;
      }

      // window.URL.createObjectURL()
      var fileUrl = window.URL.createObjectURL(file);
      thumbnails_.insertAdjacentHTML(
        'afterBegin', '<img src="' + fileUrl + '" width="75" height="75" alt="' + file.name + '" title="' + file.name + '" />');
        */
      /*// FileReader
      var reader = new FileReader();

      reader.onerror = function(evt) {
         alert('Error code: ' + evt.target.error.code);
      };
      reader.onload = (function(aFile) {
        return function(evt) {
          if (evt.target.readyState == FileReader.DONE) {
            thumbnails_.insertAdjacentHTML(
                'afterBegin', '<img src="' + evt.target.result + '" width="75" height="75" alt="' + aFile.name + '" title="' + aFile.name + '" />');
          }
        };
      })(file);

      reader.readAsDataURL(file);*/
      //}

    return false;
  };

  
  el_.addEventListener("dragenter", this.dragenter, false);
  el_.addEventListener("dragover", this.dragover, false);
  el_.addEventListener("dragleave", this.dragleave, false);
  el_.addEventListener("drop", this.drop, false);
};