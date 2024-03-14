https://socket.io/get-started/chat
https://socket.io/docs/v4/client-socket-instance/

1)
// Server Code
socket.on("disconnect", () => {
console.log("Socket Disconnected From the Server")
})
=> This gets triggered when the frontend Page is refreshed.
2)
// Client Code
socket.on("disconnect", () => {
console.log("Socket Disconnected From the Client"); // undefined
});
=> This gets triggered when certain even very small changes are made in the server/index file.

3)
=> The socket gets initialized only when the playonline button is clicked rather than initializing it in the useEffect.