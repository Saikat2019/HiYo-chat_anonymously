// Your web app's Firebase configuration
  
  const firebaseConfig = {
    apiKey: "AIzaSyA3RhPTyziItTjZLHOC_KFqvnkGIvjiBj8",
    authDomain: "hiyo-fbc1d.firebaseapp.com",
    databaseURL: "https://hiyo-fbc1d-default-rtdb.firebaseio.com",
    projectId: "hiyo-fbc1d",
    storageBucket: "hiyo-fbc1d.appspot.com",
    messagingSenderId: "294932147146",
    appId: "1:294932147146:web:dcfc5e88f86a9b7c587d33",
    measurementId: "G-P9M2L3WKYB"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var currentSite="";
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    currentSite = (new URL(url)).hostname;
    document.getElementById("current-website").innerHTML=currentSite;
  });

  firebase.database().ref("messages").on("child_removed", function (snapshot) {
    document.getElementById("message-" + snapshot.key).innerHTML = "This message has been deleted";
  });

  function deleteMessage(self) {
    var messageId = self.getAttribute("data-id");
    firebase.database().ref("messages").child(messageId).remove();
  }


  function sendMessage() {
    var message = document.getElementById("message").value;
    firebase.database().ref("messages").push().set({
      "message": message,
      "sender": myName,
      "website":currentSite
    });
    return false;
  }