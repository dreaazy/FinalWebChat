/* searching for new users of groups */
let form = document.getElementById("searchForm");


function toggleChatList() {
  /* console.log("ciao"); */
  var chatlist = document.querySelector('.chatlist');
  var chatbox = document.querySelector('.chatbox');

  var windowWidth = window.innerWidth;

  let button = document.getElementById("toggle-chat-button");


  // Check if the window width is less than or equal to 767px
  if (windowWidth <= 767) {
    // Toggle the display of the chatlist
    if (chatlist.style.display === 'block') {

      button.innerHTML = "show chat list";
      
      chatbox.style.display = 'block';
      chatlist.style.display = 'none';
    } else {
      button.innerHTML = "hide chat list";
      chatbox.style.display = 'none';
      chatlist.style.display = 'block';
    }
  } else {
    if (chatlist.style.display === 'block') {
      
      button.innerHTML = "show chat list";
      chatlist.style.display = 'none';
    } else {
      button.innerHTML = "hide chat list";
      chatlist.style.display = 'block';
    }
  }

}

// #region testing

function scrollToBottom() {
  var msgBodyContainer = document.getElementById("body-of-messages");
  msgBodyContainer.scrollTop = msgBodyContainer.scrollHeight;
}

function scrollToLastMessage() {
  var lastMessage = document.getElementById("last-message");
  if (lastMessage) {
    lastMessage.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }
}

// #endregion

// #region timer

function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

let LastMessageDate = "";

function CheckNewMessages() {
  /* data  */
  let date = getCurrentDateTime();

  const path = "rqst/rqstUsers.php?f=message&a=lastmessage";
  const body = {};

  const callback = function (response, error) {
    if (error) {
    } else {
      if (response.error) {
        console.log(response.error);
      } else if (response.success) {
        console.log(response.success.LastMessageDate);

        let temp = response.success.LastMessageDate;

        if (temp != LastMessageDate) {
          document.getElementById("msg-body-list").innerHTML = "";

          FetchMessages();

          scrollToLastMessage();

          LastMessageDate = temp;
        } else {
          console.log("non si sono nuovi messaggi!");
          LastMessageDate = temp;
        }
      }
    }
  };

  FetchGet(path, callback);
}

function TakeMessages(date1, date2) {
  const path = `rqst/rqstUsers.php?f=message&a=newmessages&date1=${date1}&date2=${date2}`;

  const callback = function (response, error) {
    if (error) {
      console.error("Request failed:", error);
    } else {
      if (response.success) {
        let messagesData = response.success;

        console.log(response);
      } else {
      }
    }
  };

  FetchGet(path, callback);
}

// Set the interval time in milliseconds
const intervalTime = 5000; // every second

setInterval(CheckNewMessages, intervalTime);

// #endregion

// #region Functional Functions

form.addEventListener("submit", (e) => {
  document.getElementById("Closed-tab").click();

  e.preventDefault();
  let toSearch = document.getElementById("searchValue").value;

  caricaJsonPost(toSearch);
});

/* do a fetch post with a callback */

function FetchPost(path, body, callback) {
  const xhttp = new XMLHttpRequest();

  xhttp.open("POST", path, true);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const rsp = this.responseText;
        const obj = JSON.parse(rsp);
        callback(obj);
      } else {
        callback(null, new Error("Request failed"));
      }
    }
  };

  const bodyreq = JSON.stringify(body);

  xhttp.send(bodyreq);
}
/* do a fetch get with call back */
function FetchGet(path, callback) {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", path, true);

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const rsp = this.responseText;
        const obj = JSON.parse(rsp);
        callback(obj);
      } else {
        callback(null, new Error("Request failed"));
      }
    }
  };

  xhttp.send();
}

// #endregion

// #region Chats Functions

function LoadMyChats() {
  let body = {};

  FetchPost("inc/testingMyChats.php", body, function (data, error) {
    if (error) {
      console.error(error);
      return;
    }

    document.getElementById("my-chats").innerHTML = "";
    let users = data.success;

    users.forEach(function (user) {
      document.getElementById("my-chats").innerHTML += `
        <a href="profile.php?user=${user.username}" class="d-flex align-items-center">
          <div class="flex-shrink-0">
              <img class="img-fluid rounded-circle" src="${user.img}" alt="user img" style="width: 50px; height: 50px;">
              <span class="active"></span>
          </div>
          <div class="flex-grow-1 ms-3">
              <h3>${user.username}</h3>
              <p>${user.Nome} ${user.Cognome}</p>
          </div>
        </a>
      `;
    });
  });
}

// #endregion

function CaricaChattingUser() {
  /* const path = "inc/loadChattingUser.inc.php"; */

  const path = "rqst/rqstUsers.php?f=search";
  const body = {}; // No body required for this request

  // Callback function to handle the response
  const callback = function (response, error) {
    if (error) {
      // Handle error
      document.getElementById(
        "head-chatting-user"
      ).innerHTML = `<p>Error: ${error.message}</p>`;
    } else {
      // Clear previous content
      const userProfileElement = document.getElementById("head-chatting-user");
      userProfileElement.innerHTML = "";

      if (response.error) {
        // Display the error message
        /* userProfileElement.innerHTML = `<p>Error: ${response.error}</p>`; */
        console.log(response.error);
      } else if (response.success) {
        // Extract user data from success response
        const userData = response.success;
        console.log(userData);
        // Render user data
        userProfileElement.innerHTML = `
            <div class="row">
              <!-- PROFILE INFORMATION OF CHATBOX -->
              <div class="col-8">
                <div class="d-flex align-items-center">
                  <span class="chat-icon"></span>
                  <div class="flex-shrink-0">
                    <img class="img-fluid" src="${userData.img}" alt="user img" style="width: 50px; height: 50px;">
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h3>${userData.username}</h3>
                    <p>${userData.Nome} ${userData.Cognome}</p>
                  </div>
                </div>
              </div>
              <!-- PROFILE INFORMATION OF CHATBOX -->
  
              <div class="col-4">
                <ul class="moreoption">
                  <li class="navbar nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">Action</a></li>
                      <li><a class="dropdown-item" href="#">Another action</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          `;
      }
    }
  };

  // Make the POST request using FetchPost
  FetchGet(path, callback);
}

function caricaJsonPost(text) {
  let body = { SearchText: text };

  FetchPost("inc/search.inc.php", body, function (data, error) {
    if (error) {
      console.error(error);
      return;
    }

    document.getElementById("chat-list").innerHTML = "";

    data.forEach(function (user) {
      document.getElementById("chat-list").innerHTML += `
        <a href="profile.php?user=${user.username}" class="d-flex align-items-center">
          <div class="flex-shrink-0">
              <img class="img-fluid rounded-circle" src="${user.img}" alt="user img" style="width: 50px; height: 50px;">
              <span class="active"></span>
          </div>
          <div class="flex-grow-1 ms-3">
              <h3>${user.username}</h3>
              <p>${user.Nome} ${user.Cognome}</p>
          </div>
        </a>
      `;
    });
  });
}

function SendMessage(event) {
  event.preventDefault();

  // Get the message from the input field
  let message = document.getElementById("input-text-message").value;

  const path = "inc/messageAConversation.inc.php";
  const body = { Message: message }; // Construct the request body

  // Callback function to handle the response
  const callback = function (response, error) {
    if (error) {
      console.error("Request failed:", error);
    } else {
      console.log(response);

      if (response.success) {
      }
    }

    /* AGGIORNO */
    // Clear message body and fetch messages again
    let messagesBody = document.getElementById("msg-body-list");
    messagesBody.innerHTML = "";

    /* per mostrare i messaggi */
    FetchMessages();

    scrollToBottom();
  };

  // Make the POST request using FetchPost
  FetchPost(path, body, callback);
}

// #region Messages

/* FETCH MESSAGES */
function FetchMessagesInRange() {
  const path = "inc/fetchMessagesBetweenTwoDates.inc.php";
  const body = { date1: "2024-02-21", date2: "2025-12-01" }; // No body required for this request

  // Callback function to handle the response
  const callback = function (response, error) {
    if (error) {
      // Handle errors or other responses here
      console.error("Request failed:", error);
    } else {
      /* console.log(response); */ // Log the response text

      /* taking the ul where I'm going to append all the messages */
      let messagesBody = document.getElementById("msg-body-list");

      // Check if the response indicates success
      if (response.success) {
        let messagesData = response.success;
        let idSender = response.IDSender;

        /* console.log(idSender);
        console.log(messagesData); */

        messagesData.forEach(function (element) {
          // Create a new li element
          var li = document.createElement("li");

          // Create new elements for the message
          var p = document.createElement("p");
          var span = document.createElement("span");

          if (element.IDUtente == idSender) {
            li.className = "sender";
          } else {
            li.className = "repaly";
          }

          // Set text content of the circle (you can customize this)
          p.textContent = element.Contenuto;
          span.textContent = element.DataCreazione;

          span.className = "time";

          // Append circle to li
          li.appendChild(p);
          li.appendChild(span);

          // Append li to ul
          messagesBody.appendChild(li);
        });
      } else {
        //if I have no one to chat with

        let bodyMessages = document.getElementById("body-of-messages");

        bodyMessages.innerHTML = "";

        bodyMessages.innerHTML = `
          <div class="d-flex justify-content-center align-items-center style="height:100%;width:100%;">
            <p>
              start chatting with someone
            </p>
          </div>
      `;
      }
    }
  };

  // Make the POST request using FetchPost
  FetchPost(path, body, callback);
}

function FetchMessages() {
  const path = "inc/fetchMessages.inc.php";
  const body = {}; // No body required for this request

  // Callback function to handle the response
  const callback = function (response, error) {
    if (error) {
      // Handle errors or other responses here
      console.error("Request failed:", error);
    } else {
      console.log(response); // Log the response text

      /* taking the ul where I'm going to append all the messages */
      let messagesBody = document.getElementById("msg-body-list");

      // Check if the response indicates success
      if (response.success) {
        let messagesData = response.success;
        let idSender = response.IDSender;

        console.log(idSender);
        console.log(messagesData);

        let previousDate = null;

        messagesData.forEach(function (element, index) {
          // Create a new li element
          var li = document.createElement("li");

          // Create new elements for the message
          var p = document.createElement("p");
          var spanTime = document.createElement("span");

          if (element.IDUtente == idSender) {
            li.className = "sender";
          } else {
            li.className = "repaly";
          }

          // Format the time
          var date = new Date(element.DataCreazione);
          var formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });

          // Check if date changed
          var currentDate = date.toLocaleDateString();
          if (currentDate !== previousDate) {
            // Create a new li for the day
            var liDay = document.createElement("li");
            liDay.className = "day";
            liDay.textContent = currentDate;
            messagesBody.appendChild(liDay);
            previousDate = currentDate;
          }

          // Set text content of the message and time
          p.textContent = element.Contenuto;
          spanTime.textContent = formattedTime;

          spanTime.className = "time";

          // Append message and time to li
          li.appendChild(p);
          li.appendChild(spanTime);

          // Append li to ul
          messagesBody.appendChild(li);

          // Scroll to the last message
          if (index === messagesData.length - 1) {
            li.scrollIntoView({ behavior: "auto", block: "end" });
          }
        });
      } else {
        //if I have no one to chat with

        let bodyMessages = document.getElementById("body-of-messages");

        bodyMessages.innerHTML = "";

        bodyMessages.innerHTML = `
          <div class="d-flex justify-content-center align-items-center style="height:100%;width:100%;">
            <p>
              start chatting with someone
            </p>
          </div>
      `;
      }
    }
  };

  // Make the POST request using FetchPost
  FetchPost(path, body, callback);
}

// #endregion

function LoadUserProfile() {
  const path = "inc/loadUserProfile.inc.php";
  const body = {}; // No body required for this request

  // Callback function to handle the response
  const callback = function (response, error) {
    if (error) {
      // Handle errors or other responses here
      console.error("Request failed:", error);
    } else {
      // Clear previous content
      const userProfileElement = document.getElementById("profile-container");
      userProfileElement.innerHTML = "";

      if (response.error) {
        // Display the error message
        userProfileElement.innerHTML = `<p>Error: ${response.error}</p>`;
      } else if (response.success) {
        // Extract user data from success response
        const userData = response.success;

        // Render user data
        const userProfileHTML = `
        <a class="" href="profile.php?user=${userData.username}">
        <div class="d-flex align-items-center">
            <img src="${userData.img}" alt="${userData.username}" class="rounded-circle" style="width: 40px; height: 40px; margin-right: 8px;">
            <span class="navbar-text">${userData.username}</span>
        </div>
    </a>
    
        `;

        // Replace the content of userProfileElement with the generated HTML
        userProfileElement.innerHTML = userProfileHTML;
      } else {
        // Handle unexpected response structure
        userProfileElement.innerHTML = `<p>Unexpected response structure</p>`;
      }
    }
  };

  // Make the POST request using FetchPost
  FetchPost(path, body, callback);
}
