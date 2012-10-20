 $(document).ready(function() {
        

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

    //Click Handler for tags 
    $("#tags a").click(function() {
        console.log($(this).text());
    });
});
