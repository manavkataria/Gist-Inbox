 $(document).ready(function() {
        
    //Click Handler for tags 
    $("#tags a").click(function() {
        console.log($(this).text());
    });


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

   //Draw Tag Cloud
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
      maxSpeed: 0.05
    },'tags')) {
      // something went wrong, hide the canvas container
      $('#myCanvasContainer').hide();
    }


});
