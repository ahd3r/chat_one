const io = require('../../utils/sockets');
const controler = require('./controler');

io.getIo().on('add email',controler);
io.getIo().on('delete email',controler);
io.getIo().on('confirm by this token',controler);
io.getIo().on('get email',controler);
io.getIo().on('get emails',controler);
