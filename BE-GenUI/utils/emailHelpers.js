require("dotenv").config();
const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in environment variables!");
}

if (!process.env.SENDER_EMAIL) {
  console.error("❌ SENDER_EMAIL is missing in environment variables!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpMail = async (email, otp) => {
  console.log("--> inside sendOtpMail", email, otp);
  console.log("Using sender:", process.env.SENDER_EMAIL);

  try {
    const response = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "GenUI - OTP Verification",
      html: `
        <html>
          <head>
            <style>
              main {
                height: 500px;
                width: 500px;
                margin: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: black;
                color: white;
                font-size: 28px;
              }
            </style>
          </head>
          <body>
            <main>
              <h2>Your OTP is: ${otp}</h2>
            </main>
          </body>
        </html>
      `,
    });

    console.log("---> Email sent! Resend response:", response);
    return true;
  } catch (err) {
    console.error("------------ 🔴 Could not send email ------------");
    console.error(err);

    if (err.response) console.error("Resend response error:", err.response);

    throw new Error("Error in sending email via Resend!");
  }
};

module.exports = { sendOtpMail };
