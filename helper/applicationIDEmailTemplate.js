
const applicationIDTemplate = (applicationID) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Application Submitted</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;padding:30px;">
              
              <tr>
                <td align="center" style="padding-bottom:20px;">
                  <h2 style="margin:0;color:#333;">Application Submitted Successfully 🎉</h2>
                </td>
              </tr>
    
              <tr>
                <td style="color:#555;font-size:15px;line-height:1.6;">
                  <p>Dear Applicant,</p>
    
                  <p>Thank you for submitting your application.</p>
    
                  <p>Your Application ID is:</p>
    
                  <div style="text-align:center;margin:25px 0;">
                    <span style="display:inline-block;background:#1a73e8;color:#ffffff;
                    padding:12px 25px;border-radius:6px;font-size:18px;
                    font-weight:bold;letter-spacing:1px;">
                      ${applicationID}
                    </span>
                  </div>
    
                  <p>Please keep this ID safe. You will need it to track your application status.</p>
    
                  <p>If you have any questions, feel free to contact our support team.</p>
    
                  <p style="margin-top:30px;">
                    Regards,<br/>
                    <strong>Your Organization Name</strong>
                  </p>
                </td>
              </tr>
    
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
    return htmlContent
}

module.exports = {applicationIDTemplate}
