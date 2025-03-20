export function WelcomeEmailTemplate({
  username = "User",
  loginUrl = "https://vidoe.com/login",
  verificationUrl = "https://vidoe.com/verify",
}: {
  username?: string
  loginUrl?: string
  verificationUrl?: string
}) {
  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#333" }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="https://vidoe.com/logo.png" alt="Vidoe Logo" style={{ height: "50px" }} />
      </div>

      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
        <h1 style={{ color: "#e11d48", marginBottom: "20px" }}>Welcome to Vidoe!</h1>

        <p>Hello {username},</p>

        <p>Thank you for joining Vidoe, your ultimate destination for movies and entertainment!</p>

        <p>Please verify your email address by clicking the button below:</p>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={verificationUrl}
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
            Verify Email Address
          </a>
        </div>

        <p>With your verified account, you can:</p>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.5" }}>
          <li>Browse our extensive collection of movies</li>
          <li>Create and manage your watchlist</li>
          <li>Rate and review movies</li>
          <li>Receive personalized recommendations</li>
        </ul>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={loginUrl}
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
            Log In to Your Account
          </a>
        </div>

        <p>
          If you have any questions or need assistance, please don't hesitate to contact our support team at
          support@vidoe.com.
        </p>

        <p>Enjoy your movie experience!</p>

        <p>
          Best regards,
          <br />
          The Vidoe Team
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

