// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "api_key",
    authDomain: "auth_domain",
    databaseURL: "database_url",
    projectId: "project_id",
    storageBucket: "storage_bucket",
    messagingSenderId: "sender_id",
    appId: "app_id",
    measurementId: "measurement_id"
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