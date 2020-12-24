var $messages = $('.messages-content'),
    d, h, m,
    i = 0;

var myName = "";
var currentSite = "";


$(window).load(function() {

  chrome.storage.local.get(['username'], function(result){
    myName = result.username;
    // alert(myName);
      if(myName=="" || myName==undefined || myName==null){
        document.getElementById("divUsername").style.display="block";
        // myName = window.prompt("Enter your name");
        // chrome.storage.local.set({'username':myName}, function(){
        //   alert(myName);
        // });
      }
  });
  
  
  
  
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    currentSite = (new URL(url)).hostname;
    document.getElementById("current-website").innerHTML=currentSite;
  });



  $messages.mCustomScrollbar();

  document.getElementById('submitUsername').addEventListener("click", function() {
      var x = document.getElementById("divUsername");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        document.getElementById("chosenUnameInfo").style.display="none";
        myName = document.getElementById("inputUsername").value;
        if(myName != ""){
          firebase.database().ref("usernames").orderByChild("username").equalTo(myName).once("value", snapshot=>{
            if(snapshot.exists()){
                // alert("username exist");
                document.getElementById("chosenUnameInfo").style.display="block";
            }else{
                  firebase.database().ref("usernames").push().set({
                    "username":myName
                  });
                  chrome.storage.local.set({'username':myName}, function(){
                    alert("Go to any webpage and chat with the people who are on the same website");
                  });
                  x.style.display = "none";
                }
          });
        
      }
    }
  });

  firebase.database().ref("messages").orderByChild("website").equalTo(currentSite).limitToLast(25).on("child_added", function (snapshot) {
    // if(snapshot.val().website == currentSite){
      if (snapshot.val().sender == myName) {
        $('<div class="message message-personal"><figure class="avatar"><img src="avatar_others.png" /></figure><div id="message-' + snapshot.key + '">' + snapshot.val().message + '</div></div>').appendTo($('.mCSB_container')).addClass('new');
        // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpdX6tPX96Zk00S47LcCYAdoFK8INeCElPeJrVDrh8phAGqUZP_g
        $('.message-input').val(null);
      } else {
        $('<div class="message new"><figure class="avatar"><img src="avatar_others.png" /></figure><div id="message-' + snapshot.key + '">' + snapshot.val().sender + ': ' + snapshot.val().message + '</div></div>').appendTo($('.mCSB_container')).addClass('new');
      }
    // }
    setDate();
    updateScrollbar();
  });

});

function updateScrollbar() {
  $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
    scrollInertia: 10,
    timeout: 0
  });
}

function setDate(){
  d = new Date()
  if (m != d.getMinutes()) {
    m = d.getMinutes();
    $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
  }
}

function insertMessage() {
  msg = $('.message-input').val();
  if ($.trim(msg) == '') {
    return false;
  }

  sendMessage();
}

$('.message-submit').click(function() {
  insertMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    insertMessage();
    return false;
  }
});




///adding function for detecting link in normal text 

// function findLink(text) {
    // var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    // return text.replace(urlRegex, function(url) {
        // return '<a href="' + url + '">' + url + '</a>';
    // });
// }


// var txt = 'Text will take you to http://www.example.com and this is my website';
// var link_found = findLink(text);

// console.log(link_found)