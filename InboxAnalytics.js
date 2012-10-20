 $(document).ready(function() {

    /* Global Variables */
    var deleteMode = false;
    
    //json parsing
    function jsonparse() {
        var jsonp = '[{"keyword":"C", "count":20}, {"keyword":"JavaScript","count":40}, {"keyword":"Java","count":20}, {"keyword":"Python","count":30}]';
        var lang = '<ul>';
        var obj = $.parseJSON(jsonp);
        $.each(obj, function() {

            lang += '<li><a style="font-size: ' + this['count'] + 'pt" href="#">' + this['keyword'] + "</a></li>";
        });
        lang += '</ul>';

        $('#tags').html(lang);
    }

    jsonparse();

    // Canvas Right Click:
    $('#myCanvasContainer').on('contextmenu', '#myCanvas', function(e){ 
        //toggle delete mode
        deleteMode = !deleteMode;
        //Toggle Cursor to Indicate deleteMode        
        console.log(deleteMode);

        console.log(event.which);   
        return false; 
    });

    //Click Handler for tags 
    $("#tags a").click(function(event) {
      event.preventDefault();

      switch (event.which) {
        case 1:
            //alert('Left mouse button pressed');
            break;
        case 2:
            //alert('Middle mouse button pressed');
            break;
        case 3:
            //alert('Right mouse button pressed');
            break;
        default:
            //alert('You have a strange mouse');
      }
     
      console.log(event.which);
      console.log($(this).text());

      if (deleteMode) {
        $(this).remove();
        drawCloud();
      }

    });

    //Draw Tag Cloud
   function drawCloud() {
    if(!$('#myCanvas').tagcanvas({
      textColour: '#ff0000',
      outlineColour: '#ff00ff',
      weightMode: 'both',
      weightGradient:  {
        0:    '#f00', // red
        0.33: '#ff0', // yellow
        0.66: '#0f0', // green
        1:    '#00f'  // blue
      },
      reverse: true,
      depth: 0.8,
      weight: true,
      maxSpeed: 0.03
    },'tags')) {
      // something went wrong, hide the canvas container
      $('#myCanvasContainer').hide();
    }
   }

   drawCloud();
});
