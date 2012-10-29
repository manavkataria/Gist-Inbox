<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
    <title>Inbox Analytics > Sender Metrics </title>
    <!--[if lt IE 9]><script type="text/javascript" src="excanvas.js"></script><![endif]-->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="jquery.tagcanvas.min.js" type="text/javascript"></script>
    <link href="light.css" type="text/css" rel="stylesheet">
	  
    <link rel="stylesheet" type="text/css" href="style.css" />

</head>
<?php

include_once("class.contextio.php");
$body = null;
$body_dic = array();

// see https://console.context.io/#settings to get your consumer key and consumer secret.
$contextIO = new ContextIO('v0mwy4ku','w6nhu3KVcUc0c3y4');
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

//$searchWord = $_GET['word'];
$searchWord = '/Xoom/i';
//$searchEmail = 'noreply@github.com';

//$args = array('folder'=>"Inbox", 'subject' => '/reset/', 'limit'=>1,  'include_body' => 1);
$args = array('folder'=>"Inbox", 'subject' => $searchWord, 'limit'=>1, 'include_body' => 1);
//$args = array('folder'=>"Inbox", 'subject' => "/" . $searchWord . "/", 'limit'=>3, 'include_body' => 1);

//echo $searchWord;
$r = $contextIO->listMessages($accountId, $args);


if ( $r->getData() == null ) {
	//echo strtoupper($searchWord);
	$args = array('subject' => strtoupper($searchWord), 'limit'=>3);
	$r = $contextIO->listMessages($accountId, $args);
	if( $r->getData() == null ) {
		echo "No Results !";
		exit(0);
	}
}
	
foreach ($r->getData() as $message) {
	$body = $body . " " . $message['body'][0]['content'];
	//print_r($message['body'][0]['content']);
	//$from = $from . " " . $message['addresses']['from']['email'];
	//echo "Body   : ".$message['body'][0]['content']."<br>";
}

$body = formatText($body);
$body_dic = getDic($body);
unset($body_dic[' ']);
arsort($body_dic);
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
	
		$tags = $tags . '<li> <a style="font-size: ' . $count*3 . 'pt" href="getData.php?email='. $keyword .'">' . $keyword . "</a></li>";
	
	}
	return $tags;
}
$tags = getTags($body_dic);

//print($tags);
?>

  <body>
    <h1 align="center">Inbox Analytics</h1>
    <h2 align="center">Sender Metrics</h2>
    
    <div id="myCanvasContainer" align="center">
      <canvas align="center" width="600" height="400" id="myCanvas" style="border: 1px solid black">
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
      //event.preventDefault();

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
      maxSpeed: 0.03
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

