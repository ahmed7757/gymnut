import nodemailer from "nodemailer";

function renderBaseEmail(options: {
    brandName?: string;
    brandColor?: string;
    title: string;
    intro: string;
    buttonLabel: string;
    buttonUrl: string;
    footerNote?: string;
}) {
    const brandName = options.brandName || "GymNut";
    const brandColor = options.brandColor || "#16a34a"; /* Tailwind green-600 */
    const footerNote = options.footerNote || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;

    return `<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${options.title}</title>
    <style>
      @media (prefers-color-scheme: dark) {
        .bg-body { background-color: #0b0f15 !important; }
        .card { background-color: #121826 !important; box-shadow: none !important; }
        .text { color: #e5e7eb !important; }
        .muted { color: #9ca3af !important; }
        .btn { background-color: ${brandColor} !important; color: #ffffff !important; }
      }
      @media only screen and (max-width: 600px) {
        .container { width: 100% !important; }
        .content { padding: 20px !important; }
        .btn a { display: block !important; width: 100% !important; }
      }
      a { text-decoration: none; }
    </style>
  </head>
  <body class="bg-body" style="margin:0;padding:24px 16px;background:#f6f7fb;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';">
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" class="container" style="max-width:600px;">
            <tr>
              <td style="padding: 0 0 12px 0; text-align:center;">
                <div style="font-weight:700;font-size:20px;color:${brandColor};letter-spacing:0.2px;">${brandName}</div>
              </td>
            </tr>
            <tr>
              <td class="card" style="background:#ffffff;border-radius:12px;box-shadow:0 6px 16px rgba(16,24,40,0.08);overflow:hidden;">
                <table role="presentation" width="100%">
                  <tr>
                    <td style="background:${brandColor};padding:16px 20px;color:#ffffff;font-weight:600;font-size:16px;">${options.title}</td>
                  </tr>
                  <tr>
                    <td class="content text" style="padding:24px 28px 8px 28px;color:#111827;font-size:14px;line-height:1.7;">
                      <p style="margin:0 0 12px 0;">${options.intro}</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 8px 28px 24px 28px;">
                      <table role="presentation" class="btn" style="border-collapse:separate;">
                        <tr>
                          <td style="background:${brandColor};border-radius:8px;">
                            <a href="${options.buttonUrl}" style="display:inline-block;padding:12px 22px;color:#ffffff;font-weight:600;">${options.buttonLabel}</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="text" style="padding:0 28px 24px 28px;font-size:13px;line-height:1.6;color:#374151;">
                      <p style="margin:0 0 6px 0;">If the button doesn't work, copy and paste this link into your browser:</p>
                      <p style="margin:0;word-break:break-all;"><a href="${options.buttonUrl}" style="color:${brandColor};text-decoration:underline;">${options.buttonUrl}</a></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding:14px 8px 0 8px;" class="muted">
                <div style="font-size:12px;color:#6b7280;">${footerNote}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

export class EmailService {
    static async sendResetPasswordEmail(to: string, resetUrl: string) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.AUTH_GOOGLE_EMAIL,
                pass: process.env.AUTH_GOOGLE_APP,
            },
        });

        const html = renderBaseEmail({
            brandName: "GymNut",
            brandColor: "#16a34a",
            title: "Password Reset Request",
            intro: "You requested to reset your password. Please click the button below to set a new password. This link will expire in <strong>1 hour</strong>.",
            buttonLabel: "Reset Password",
            buttonUrl: resetUrl,
        });

        await transporter.sendMail({
            from: process.env.AUTH_GOOGLE_EMAIL,
            to,
            subject: "Reset Password",
            text: `Reset your password: ${resetUrl}`,
            html,
        });
    }
}
