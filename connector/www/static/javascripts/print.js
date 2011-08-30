/**
 *  PrintJS 
 */

 window.onload = function() {
      // You may want to place these lines inside an onload handler
      CFInstall.check({
        mode: "inline", // the default
        node: "prompt"
      });

      thingiurlbase = "/static/javascripts/thingiview/javascripts";
      thingiview = new Thingiview("viewer");
      thingiview.setObjectColor('#C0D8F0');
      thingiview.initScene();
      // thingiview.setShowPlane(true);
      if (getUrlVars()["stl"]) {
        thingiview.loadSTL(getUrlVars()["stl"]);
      } else {
      // default obj?
      //   thingiview.loadSTL("../examples/objects/cube.stl");
      }
      

        var s = new io.Socket(window.location.hostname, {port: 8001, rememberTransport: false});
        s.connect();

        s.addEvent('connect', function() {
            //s.send('New participant joined');
        });

        s.addEvent('message', function(data) {
            $("#chat").append($("<div>",{text:data}));
        });

        //send the message when submit is clicked
        $('#chatform').submit(function (evt) {
            var line = $('#chatform [type=text]').val()
            $('#chatform [type=text]').val('')
            s.send(line);
            return false;
        });
    };
    
    function getUrlVars() {
    	var vars = {};
    	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    		vars[key] = value;
    	});
    	return vars;
    }   
    
    // model drag and drop support
    var reader = new FileReader();
    reader.onload = function(e) {
     document.querySelector('img').src = e.target.result;
    };
    function onDrop(e) {
     reader.readAsDataURL(e.dataTransfer.files[0]);
    };
    document.addEventListener('DOMContentLoaded', function(e) {
     var dndc = new DNDFileController('dropzone');
    }, false);

$(document).ready(function() {
  $('#print').click(function() {
    alert('Your model is now printing! Enjoy!');
    $.post('/',  $('#print').data('text'), function() {
        });
  });
  
   // static urls
   $('.file').click(function() {
    var file_name = $(this).attr('file');
    var sample_reader = new FileReader();
    
    sample_reader.onload = (function(theFile) {
      console.log('loaded');
      return function(e) {
        current_file_data = $.base64Decode(e.target.result.replace(/^data:base64,/, ''));
        $('#print').data('text', current_file_data);
      };
    })(file_name);
    
    eval('thingiview.load'+$(this).attr('filetype')+'(file_name)');
    sample_reader.readAsDataURL(file_name);
    $('.video').hide();
    
  });
  
  
  $("#enable-debug-pane").click(function(){
    $("#debug-pane").show();
    $("#enable-debug-pane").hide();
  });
  
});
