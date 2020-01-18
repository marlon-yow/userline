 // Servidor: app.js

const app = require('http').createServer(index);
const io = require('socket.io')(app);
const fs = require('fs');
const port = 3000;
 
 app.listen(port, function() {
   if(DBG) console.log("Servidor rodando!");
 });
 
 function index(req, res){
    if(DBG) console.log(req.url);
    
    if(req.url == '/admin'){
        fs.readFile(__dirname + '/admin.html', function(err, data){
            res.writeHead(200);
            res.end(data);
        });    
    }else if(req.url == '/fvicon'){
        fs.readFile(__dirname + '/favicon.png', function(err, data){
            res.writeHead(200);
            res.end(data);
        });
    }else{
        fs.readFile(__dirname + '/index.html', function(err, data){
            res.writeHead(200);
            res.end(data);
        });
    }     
 };
 
 // Iniciando Socket.IO
 var visualizando = 0;
 var clientesAtivos = 0;
 var clientesFila = 0;
 var mensagem = '';
 var DBG = 1;
 
 // Evento connection ocorre quando entra um novo usuário.
 io.on('connection', function(socket){
    visualizando++;

    /* ADMIN MODE */
    socket.on('set ativos', function(quantidade){
        clientesAtivos = quantidade;
        io.emit('ativos', clientesAtivos);
        if(DBG) console.log("set ativos",quantidade);
    });

    socket.on('set fila', function(quantidade){
        clientesFila = quantidade;
        io.emit('fila', clientesFila);
        if(DBG) console.log("set fila",quantidade);
    });

    socket.on('set mensagem', function(msg){
        mensagem = msg;
        io.emit('mensagem', mensagem);
        if(DBG) console.log("set mensagem",mensagem);
    });

    /* USER MODE */
    socket.on('all',function(){
        socket.emit('ativos', clientesAtivos);
        socket.emit('fila', clientesFila);
        socket.emit('mensagem', mensagem);
        socket.emit('visualizando', visualizando);
        if(DBG) console.log("all");
    });
    
    /* teste de loop infinito*
    socket.on('my other event', function (data) {
        socket.emit('news', data+1 );
        console.log(data);
    });/**/
     
      
   // Envia o total de visitas para o novo usuário.
   //socket.emit('visits', visitas);
   // Envia o total de visitas para os demais usuários.
   socket.broadcast.emit('visualizando', visualizando);
   // Evento disconnect ocorre quando sai um usuário.
   socket.on('disconnect', function(){ 
       visualizando--;
       socket.broadcast.emit('visualizando', visualizando);
    });
 });
 
 
