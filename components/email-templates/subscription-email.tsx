export function SubscriptionEmailTemplate({
  username = "Premium Member",
  planName = "Premium Annual",
  startDate = "January 1, 2023",
  endDate = "January 1, 2024",
  amount = "$99.99",
  accountUrl = "https://vidoe.com/account",
}: {
  username?: string
  planName?: string
  startDate?: string
  endDate?: string
  amount?: string
  accountUrl?: string
}) {
  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#333" }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="https://vidoe.com/logo.png" alt="Vidoe Logo" style={{ height: "50px" }} />
      </div>

      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
        <h1 style={{ color: "#e11d48", marginBottom: "20px" }}>Subscription Confirmation</h1>

        <p>Hello {username},</p>

        <p>Thank you for subscribing to Vidoe {planName}! Your subscription has been successfully processed.</p>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "5px",
            margin: "20px 0",
            border: "1px solid #ddd",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            Subscription Details
          </h3>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold" }}>Plan:</td>
              <td style={{ padding: "8px 0" }}>{planName}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold" }}>Start Date:</td>
              <td style={{ padding: "8px 0" }}>{startDate}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold" }}>End Date:</td>
              <td style={{ padding: "8px 0" }}>{endDate}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", fontWeight: "bold" }}>Amount:</td>
              <td style={{ padding: "8px 0" }}>{amount}</td>
            </tr>
          </table>
        </div>

        <p>With your premium subscription, you now have access to:</p>
        <ul style={{ paddingLeft: "20px", lineHeight: "1.5" }}>
          <li>Unlimited HD and 4K streaming</li>
          <li>Ad-free viewing experience</li>
          <li>Exclusive premium content</li>
          <li>Early access to new releases</li>
          <li>Download movies for offline viewing</li>
        </ul>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={accountUrl}
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
            Manage Your Subscription
          </a>
        </div>

        <p>
          If you have any questions about your subscription or need assistance, please contact our premium support team
          at premium@vidoe.com.
        </p>

        <p>Thank you for choosing Vidoe Premium!</p>

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
          </a>{" "}
          |
          <a href="https://vidoe.com/billing" style={{ color: "#666", textDecoration: "underline" }}>
            Billing
          </a>
        </p>
      </div>
    </div>
  )
}

