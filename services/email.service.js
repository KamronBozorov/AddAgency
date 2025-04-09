const config = require("config");
const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.get("smtp_host"),
      port: config.get("smtp_port"),
      secure: false,
      auth: {
        user: config.get("smtp_user"),
        pass: config.get("smtp_password"),
      },
    });
  }

  async sendEmail(toEmail, otp) {
    await this.transporter.sendMail({
      from: config.get("smtp_user"),
      to: toEmail,
      subject: "Tasdiqlash kodingiz (OTP)",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="max-width: 500px; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333;">📩 Tasdiqlash Kodingiz</h2>
          <p style="font-size: 16px; color: #666;">Sizning tasdiqlash kodingiz:</p>
          <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f8d7da; color: #721c24; border-radius: 5px; display: inline-block;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #777;">Bu kod 5 daqiqa ichida eskiradi.</p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">Agar siz bu xabarni noto'g'ri olgan bo'lsangiz, uni e'tiborsiz qoldiring.</p>
        </div>
      </div>
    `,
    });
  }
}

module.exports = new EmailService();
