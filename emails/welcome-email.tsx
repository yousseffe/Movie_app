interface WelcomeEmailProps {
  name: string;
  verificationUrl?: string;
}

export default function WelcomeEmail({ name, verificationUrl }: WelcomeEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#D92424 ", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#333" }}>Welcome to Movie Platform!</h1>
      </div>
      <div style={{ padding: "20px" }}>
        <p>Hello {name},</p>
        <p>Thank you for joining our Movie Platform! We're excited to have you as a member of our community.</p>
        
        {verificationUrl && (
          <>
            <p>Please verify your email address by clicking the button below:</p>
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <a
                href={verificationUrl}
                style={{
                  backgroundColor: "#0070f3",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Verify Email Address
              </a>
            </div>
          </>
        )}

        <p>With your new account, you can:</p>
        <ul>
          <li>Browse our extensive collection of movies</li>
          <li>Create and manage your watchlist</li>
          <li>Rate and review movies</li>
          <li>Receive personalized recommendations</li>
        </ul>
        <p>Get started by exploring our latest releases or searching for your favorite movies.</p>
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={process.env.NEXT_PUBLIC_APP_URL}
            style={{
              backgroundColor: "#0070f3",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Start Exploring
          </a>
        </div>
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        <p>Happy watching!</p>
        <p>The Movie Platform Team</p>
      </div>
      <div
        style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center", fontSize: "12px", color: "#666" }}
      >
        <p>© {new Date().getFullYear()} Movie Platform. All rights reserved.</p>
        <p>If you did not create this account, please contact us immediately.</p>
      </div>
    </div>
  )
}

