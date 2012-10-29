<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
    <title>Gist 4 Fun</title>
    <!--[if lt IE 9]><script type="text/javascript" src="excanvas.js"></script><![endif]-->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="jquery.tagcanvas.min.js" type="text/javascript"></script>
    <link href="light.css" type="text/css" rel="stylesheet">
	  
    <link rel="stylesheet" type="text/css" href="style.css" />

</head>
<?php

include_once("class.contextio.php");
$subject = null;
$sub_dic = array();
$from = null;
$from_dic = array();

// see https://console.context.io/#settings to get your consumer key and consumer secret.
//$contextIO = new ContextIO('v0mwy4ku','w6nhu3KVcUc0c3y4');
$contextIO = new ContextIO('tx5dlne2','TWepndqvhreGYrDa');
$accountId = null;

// list your accounts
$r = $contextIO->listAccounts();
foreach ($r->getData() as $account) {
	//echo $account['id'] . "\t" . join(", ", $account['email_addresses']) . "<br>";
	if (is_null($accountId)) {
		$accountId = $account['id'];
	}
}

if (is_null($accountId)) {
	die;
}

$searchEmail = $_GET['email'];
//$searchEmail = 'noreply@github.com';

$args = array('folder'=>"Inbox", 'from' => $searchEmail, 'limit'=>10);

$r = $contextIO->listMessages($accountId, $args);
foreach ($r->getData() as $message) {
	$subject = $subject . " " . $message['subject'];
	//$from = $from . " " . $message['addresses']['from']['email'];
	//echo "Body   : ".$message['body']."<br>";
}

$subject = formatText($subject);
$sub_dic = getDic($subject);
unset($sub_dic[' ']);
arsort($sub_dic);
//print_r($sub_dic);

//$from_dic = getDic($from);
//unset($from_dic[' ']);
//arsort($from_dic);
//print_r($from_dic);

echo "<br>";
//print_r($frequency);

function formatText($text) {
	return preg_replace('/[^a-zA-Z]/i', ' ', $text);
}

function getDic($words) {
	$words = explode(' ', $words);
	$frequency = array();
	foreach($words as $word) {
		if (!strcmp($word, ''))
			continue;
		$word = strtolower($word);
		if(isset($frequency[$word]))
			$frequency[$word] += 1;
		else
			$frequency[$word] = 1;
		//echo $frequency[$word];
	}
	return $frequency;
}

function getTags($dic) {
	$tags = ""; 
	foreach ($dic as $keyword=>$count) {
  	//$property . " is " . $value . "<br>");
  	//<li><a href="http://www.goat1000.com/fish">Fish</a></li>
    if ($count > 0 && strlen($keyword)>3 ) {
      $tags = $tags . '<li> <a style="font-size: ' . $count*10 . 'pt" href="getContent.php?word='. $keyword .'">' . $keyword . "</a></li>";    
    }
	}
	return $tags;
}
$tags = getTags($sub_dic);

//print($tags);
?>

  <body>
 
    <h1 align="center">Gist 4 Fun</h1>
    <h2 align="center">from: <?php echo $searchEmail ?></h2>
    <h3 align="center">Conent Metrics</h3>

    <div id="myCanvasContainer" align="center">
      <canvas align="center" width="600" height="400" id="myCanvas">
        <p>Unable to display Tag Cloud! Your browser does not support the canvas element!</p>
      </canvas>
    </div>
    <div id="tags">
      <ul>
        <li><a style="font-size: 20pt" href="#">medium</a></li>
        <li><a style="font-size: 40pt" href="#">Huge</a></li>
        <li><a style="font-size: 10pt" href="#">small</a></li>

      </ul>
    </div>

<script type="text/javascript">
$(document).ready(function() {

  /* Global Variables */
    var deleteMode = false;
    var borderColor = 'blue';

    var lang = '<ul>';
    lang += '<?php echo $tags; ?>';
    lang += '</ul>';
    $('#tags').html(lang);

    // Canvas Right Click:
    $('#myCanvasContainer').on('contextmenu', '#myCanvas', function(e){ 
        //toggle delete mode
        deleteMode = !deleteMode;
        if (deleteMode) {
          borderColor = 'red';
        } else {
          borderColor = 'blue';
        }        

        drawCloud();
          
        //Toggle Cursor to Indicate deleteMode        
        console.log(deleteMode);

        console.log(event.which);   
        return false; 
    });

    //Click Handler for tags 
    $("#tags a").click(function(event) {
      if (deleteMode) 
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
      outlineColour: borderColor,
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
      maxSpeed: 0.02
    },'tags')) {
      // something went wrong, hide the canvas container
      $('#myCanvasContainer').hide();
    }
   }

   drawCloud();
 });

  </script>
  
	</body>
</html>

