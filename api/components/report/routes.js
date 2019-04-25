const io = require('../../utils/sockets');
const controler = require('./controler');

io.getIo().on('send letter',controler);
