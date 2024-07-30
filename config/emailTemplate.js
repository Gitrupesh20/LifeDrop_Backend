// E-mail template for sending email verification mail
const content = (details) => {
  const body = ` <table width="600" cellpadding="0" cellspacing="0" style="background: rgb(151,57,57);
    background: radial-gradient(circle, rgba(151,57,57,1) 0%, rgba(148,187,233,1) 100%); color:white; letter-spacing:1.5px;">
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <h1 style=" font-family: Arial, sans-serif; font-size: 35px;">Hi ${details.name},</h1>
                  <p style=" font-family: Arial, sans-serif; font-size: 16px;">
                    Click the button to verify your email
                  </p>
                  <a href="${details.verificationLink}">
                    <button style="letter-spacing:1.5px; padding: 10px; width: 100px; height: 40px; border: 1px solid white; border-radius: 10px;  font-family: Arial, sans-serif; font-size: 16px; cursor: pointer;">Verify</button>
                  </a>
                  <br /> <br />
                  <p style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing:2px; float: right; bottom:0;">
                  Regards, LifeDrop
                    
                  </p>
                </td>
              </tr>
            </table>`;

  return body;
};

module.exports = { content };
