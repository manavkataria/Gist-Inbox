

function calculateTweetLen( evt ){

	// trap the event
	var evt  = (evt) ? evt : ((event) ? event : null);

	// if the event is null return
	if ( !evt ){ alert('null event'); return; }

	// ok we have an event.
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	
	// no node...return
	if ( !node ){ alert('null node'); return; }


	switch(node.id){
			case 'txtHashtags':
				break;
			case 'txtTweet':
				break;
			default:
				// not a node we care about.
				return;
	}



	var hashtags = document.getElementById( 'txtHashtags' );
	var tweet = document.getElementById( 'txtTweet' );
	var spnTweetLen = document.getElementById( 'charCounter' );
	var spnMessage = document.getElementById( 'spnMessage' );
	var btnTweet = document.getElementById( 'btnTweet' );

	var totalLength = hashtags.value.length + tweet.value.length;

	// this is a hack.  If we have hashtags and a tweet there 
	// needs to be a space between them so we have to add that 
	// to the total as well.
	if ( hashtags.value.length > 0 && tweet.value.length > 0 ){
		totalLength += 1;
	}


	spnTweetLen.innerHTML = totalLength;

	
	if ( totalLength < 120 ){

		spnTweetLen.style.color = "green";
		spnTweetLen.style.backgroundColor = "";

	}

	if ( totalLength >= 120 && totalLength < 135 ){
		
		spnTweetLen.style.color = "black";
		spnTweetLen.style.backgroundColor = "yellow";

	}

	if ( totalLength >= 135 ){

		spnTweetLen.style.color = "red";
		spnTweetLen.style.backgroundColor = "";

	} 

	if ( totalLength > 140 ){
		// disable the tweet button
		btnTweet.disabled = 'disabled';
	} else {
		// enable the tweet button
		btnTweet.disabled = '';
	}
}



window.onload=function(){
	document.onkeyup = calculateTweetLen;
}
