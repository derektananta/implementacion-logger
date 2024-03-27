const socket = io()
let user;
let chatBox = document.getElementById("chatBox")

Swal.fire({
    title: "identify yourself",
    input: "text",
    text: "Enter your email to be identified in the chat",
    inputValidator: (value) => {
        return (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) && "You need to enter your email to continue"
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value
    socket.emit("authenticate", user)
})

chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: user, message: chatBox.value })
            chatBox.value = "";
        }
    }
})

socket.on("authenticated", username => {
    alert(`You have authenticated as ${username}`);
});

socket.on("userConnected", username => {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: `${username} connected`,
        showConfirmButton: false,
        timer: 4000
    });
});

socket.on("messagesLogs", data => {
    let log = document.getElementById("messagesLogs")
    let messages = ""
    data.forEach(message => {
        messages = messages + ` ${message.user} => ${message.message} </br>`
    })
    log.innerHTML = messages;
})
