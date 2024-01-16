const $connect = $('#connect');
const $chat = $("#chat");
const $login = $('#login');
const $userName = $('#username');

$chat.hide();

const initSocketAndConnect = function() {
    const $userName = $('#username');
    let username = $userName.val();
    console.log('username: ', username);
    socket = initSocket(username);

    console.log('socket', socket);

    if (socket !== undefined && typeof socket === 'object') {
        $chat.show();
        $login.hide();
    }

    processChat(socket, username);
};

$userName.on('keypress',function(e) {
    if (e.which == 13) {
        initSocketAndConnect();
    }
});
$connect.click(initSocketAndConnect);

function initSocket(username) {
    const $chatMessages = $('#messages');
    let socket = new WebSocket("ws://127.0.0.1:3000/chat");
    
    socket.onopen = function(e) {
        socket.send(`${username} has connected`);
    };
      
    socket.onmessage = function(event) {
        let newEl = `<div class="message-item"><div class="message-plain">${event.data}</div></div>`;       
        $chatMessages.append(newEl);

    };
    
    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Closed connection, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection interrupted');
        }
    };
    
    socket.onerror = function(error) {
        console.log(error);
    };

    return socket;
}

function processChat(socket, username) {
    const $send = $('#send');
    const $message = $('#message');

    const sendMessageHandler = function() {
        console.log('message', $message.val());
        
        socket.send(username + ": " + $message.val());
        
        $message.val('');
    };

    $send.click(sendMessageHandler);
    
    $message.on('keypress',function(e) {
        if (e.which == 13) {
            sendMessageHandler();
        }
    });
}
