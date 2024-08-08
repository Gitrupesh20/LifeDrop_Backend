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

const confirmMailTemplate = (details) => {
  const { recipientName, name, age, phoneNumber, bloodGroup, address, Email } =
    details;
  const body = ` <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 2rem 0;
      padding: 0;
      font-family: Arial, sans-serif;
      letter-spacing: 2.5px;
      display: flex;
      justify-content: center;
    }
    .email-container {
      width: 600px;
      height: max-content;
      padding: 20px;
      background: radial-gradient(circle, rgba(151,57,57,1) 30%, rgba(148,187,233,1) 100%);
      color: white;
      border-radius: 10px;
    }
    .email-content {
      padding: 20px;
      font-size: 16px;
       line-height: .5;
    }
    .email-header {
      font-size: 30px;
      line-height: 1.5;
    }
    .email-body {
      font-size: 11px;
      line-height: 1.5;
    }
    .email-footer {
      font-size: 11px;
      float: right;
    }
  </style>
</head>
<body>
  <table class="email-container" cellpadding="0" cellspacing="0">
    <tr>
      <td class="email-content">
        <h2 class="email-header">Hi, ${recipientName}</h2>
        <p class="email-body">Your blood request has been accepted.<br>Following are the details of the donor:</p>
        <br/>
        <p>Name: ${name}</p>
        <p>Blood Group: ${bloodGroup}</p>
        <p>Age: ${age}</p>
        <p>Phone Number: ${phoneNumber}</p>
        <p>Email:${Email}</p>
        <p style="line-height: 1.5;">Address: ${address}</p>
        <br/>
        <p class="email-footer">Regards, LifeDrop</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return body;
};
module.exports = { content, confirmMailTemplate };
