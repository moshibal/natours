import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';
//this code is for dirname as esmodule system doesnot support this.
import path from 'path';
export const __dirname = path.resolve();

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Bishal karki <${process.env.EMAILFROM}>`;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sengrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_API_NAME,
          pass: process.env.SENDGRID_API_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '3596ef26603d05',
        pass: '12f089d4fdddda',
      },
    });
  }
  //send actual email.
  async send(template, subject) {
    //1)Render HTML based on a pug templete
    const html = pug.renderFile(`${__dirname}/views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2)Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };
    //3)create a transport and send the email.
    await this.newTransport().sendMail(mailOptions);
  }
  //variety of email sent for different proposes
  //this method is for welcome email
  async sendWelcome() {
    await this.send('_welcome', 'Welcome to the natours family');
  }
  //this method is for reset password
  async sendResetToken() {
    await this.send(
      '_resetPassword',
      'Reset token should be used for changeing password '
    );
  }
}
