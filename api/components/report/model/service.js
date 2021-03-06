const nodeMailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');

class Report{
  constructor(title,htmlBody){
    this.title=title;
    this.htmlBody=htmlBody;
  }

  static configForSendingEmail(){
    return nodeMailer.createTransport(sendGrid({
      auth:{
        api_key:'' // here must be your key
      }
    }));
  }
  async send(){
    try {
      return await Report.configForSendingEmail().sendMail({
        to:'ander11110@gmail.com',
        from:'question@from.phoneBook',
        subject:this.title,
        html:this.htmlBody
      });
    } catch (err) {
      return {err}
    }
  }
}

module.exports=Report;
