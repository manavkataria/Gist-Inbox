var express = require( 'express' );
// var OAuth= require( 'oauth' ).OAuth;
var util = require('util'),
      ImapConnection = require('imap').ImapConnection;

var dataDump = [];

var imap = new ImapConnection({
      username: 'jobhuntertexashack@gmail.com',
      password: 'texashack',
      host: 'imap.gmail.com',
      port: 993,
      secure: true
    });

function show(obj) {
  return util.inspect(obj, false, Infinity);
}

function die(err) {
  console.log('Uh oh: ' + err);
  process.exit(1);
}

function openInbox(cb) {
  imap.connect(function(err) {
    if (err) die(err);
    imap.openBox('INBOX', false, cb);
  });
}

openInbox(function(err, mailbox) {
  if (err) die(err);
  imap.search([ 'UNSEEN', ['SINCE', 'May 20, 2010'] ], function(err, results) {
    if (err) die(err);
    var fetch = imap.fetch(results, {
      request: {
        headers: ['from', 'to', 'subject', 'date']
      }
    });
    fetch.on('message', function(msg) {
      // console.log('Got a message with sequence number ' + msg.seqno);
      msg.on('end', function() {
        // msg.headers is now an object containing the requested headers ...
        dataDump.unshift( msg.headers ) ;
      });
    });
    fetch.on('end', function() {
      // console.log('Done fetching all messages!');
      imap.logout();
    });
  });
});

var app = express();
app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.session( { secret: 'zFZ.d120^G\"4=~${9u7)a' } ));
    app.use(express.static('./static/'));
    // identify the static directory used by bootstrap
    app.use(express.static( __dirname +'/assets/')); 
    app.use(express.bodyParser());
    app.use(app.router);
});

app.set('view engine', 'ejs');

app.set('view options', {
    layout: false
});

app.get('/*', function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();     
  }
})

app.get('/', function(req, res) {
  
  var twitterScreenName = '';
  var currentHashtags = '';
  // if ( req 
  //       && req.session 
  //       && req.session.twitter 
  //       && req.session.twitter.screen_name ){
  //   twitterScreenName = req.session.twitter.screen_name;
  //   currentHashtags = req.session.twitter.current_hashtags;
  // }

  // // is the user logged in?
  // console.log( 'twitterScreenName: ' + twitterScreenName );

  // // are there any current hashtags?
  // console.log( 'currentHashtags: ' + currentHashtags );


    destination_page = 'hero';


  res.render( destination_page, {
    dataDump: dataDump  
  });
});

// app.get('/auth/twitter', function(req, res){
//   // check the sessionID
//   // console.log( req.sessionID );

//   oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
//     if (error) {
//       console.log(error);
//       res.send("yeah no. didn't work.")
//     }
//     else {
//       console.log( 'creating oauth session object' );
//       req.session.oauth = {};

//       req.session.oauth.token = oauth_token;
//       console.log('oauth.token: ' + req.session.oauth.token);

//       req.session.oauth.token_secret = oauth_token_secret;
//       console.log('oauth.token_secret: ' + req.session.oauth.token_secret);

//       // check the sessionID
//       console.log( req.sessionID );

//       res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
//   }
//   });
// });

// app.get('/auth/twitter/callback', function(req, res, next){

//   // check the sessionID
//   console.log( req.sessionID );

//   if (req.session.oauth) {
//     req.session.oauth.verifier = req.query.oauth_verifier;
//     var oauth = req.session.oauth;

//     oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
//     function(error, oauth_access_token, oauth_access_token_secret, results){
//       if (error){
//         console.log(error);
//         res.send("Something's not right. Clear your browser cache and try again.");
//       } else {
//         req.session.oauth.access_token = oauth_access_token;
//         req.session.oauth.access_token_secret = oauth_access_token_secret;
        
//         if ( results ){
//           req.session.twitter = {};
//           req.session.twitter.user_id = results.user_id; 
//           req.session.twitter.screen_name = results.screen_name;
//           console.log( 'Twitter data stored in session: ' + req.session.twitter.user_id );
//         }
        
//         res.redirect( '/' );
//       }
//     }
//     );
//   } else
//     next(new Error("OOPS...something went wrong.  Do you have cookies enabled?"))
// });

// process the tweet action
// app.post( '/tweet', function( req, res, next ){

//   if ( req && req.body ){
//     var hashtags = req.body.txtHashtags;
//     var tweet = req.body.txtTweet;
//     var wholeTweet = tweet + ' ' + hashtags;

//     // make sure we have a twitter object
//     if ( !req.session.twitter ){
//       req.session.twitter = {};
//     }

//     // store the hashtags in the session variable for later.
//     req.session.twitter.current_hashtags = hashtags;

//     console.log( "access_token: " + req.session.oauth.access_token );
//     console.log( "access_token_secret: " + req.session.oauth.access_token_secret );

//     // post the tweet with the hashtags.
//     oa.post(
//       "http://api.twitter.com/1/statuses/update.json",
//       req.session.oauth.access_token, req.session.oauth.access_token_secret,
//       {"status":wholeTweet},
//       function(error, data) {
//         if(error){
//           console.log(require('sys').inspect(error));
//         } else { 
//           console.log( new Date() );
//           console.log( "@" + req.session.twitter.screen_name + ": " + wholeTweet );
//         }
//       }
//     );

//     // redirect to the form
//     res.redirect( '/' );

//   }



// } );

app.get( '/logout', function( req, res, next ){

  req.session.destroy();
  res.redirect( '/' );

} );

app.listen(3000);


