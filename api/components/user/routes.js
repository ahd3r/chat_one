const io = require('../../utils/sockets');
const controler = require('./controler');

io.getIo().on('create user',controler.createUser);
io.getIo().on('delete user',controler.delUser);
io.getIo().on('edit user',controler.editUser);
io.getIo().on('change password',controler.editPass);
io.getIo().on('get users',controler.getUsers);
io.getIo().on('get users by arr of id',controler.getUsersByArr);
io.getIo().on('get users by id',controler.getUser);
io.getIo().on('get users by search filter',controler.getUsersBySearch);
