let io;

module.exports = {
	init:(server)=>{
		io = require('socket.io')(server);
	},
	getIo:()=>{
		if(io){
			return io
		}else{
			throw new Error('Socket is not runing');
		}
	}
};
