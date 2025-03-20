export function PasswordResetEmailTemplate({
  username = "User",
  resetUrl = "https://vidoe.com/reset-password?token=xyz",
}: {
  username?: string
  resetUrl?: string
}) {
  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#333" }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="https://vidoe.com/logo.png" alt="Vidoe Logo" style={{ height: "50px" }} />
      </div>

      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
        <h1 style={{ color: "#e11d48", marginBottom: "20px" }}>Password Reset Request</h1>

        <p>Hello {username},</p>

        <p>
          We received a request to reset your password for your Vidoe account. If you didn't make this request, you can
          safely ignore this email.
        </p>

        <p>To reset your password, click the button below:</p>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={resetUrl}
            style={{
              backgroundColor: "#e11d48",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Reset Your Password
          </a>
        </div>

        <p>
          This link will expire in 24 hours. If you need a new reset link after that time, please make another request.
        </p>

        <p>
          If you didn't request a password reset, please contact our support team immediately at security@vidoe.com.
        </p>

        <p>
          Best regards,
          <br />
          The Vidoe Security Team
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#666" }}>
        <p>© 2023 Vidoe. All rights reserved.</p>
        <p>123 Movie St, Hollywood, CA</p>
        <p>
          <a href="https://vidoe.com/privacy" style={{ color: "#666", textDecoration: "underline" }}>
            Privacy Policy
          </a>{" "}
          |
          <a href="https://vidoe.com/terms" style={{ color: "#666", textDecoration: "underline" }}>
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  )
}

