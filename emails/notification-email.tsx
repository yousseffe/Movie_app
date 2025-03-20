interface NotificationEmailProps {
  name: string
  notificationTitle: string
  notificationBody: string
}

export default function NotificationEmail({ name, notificationTitle, notificationBody }: NotificationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#333" }}>{notificationTitle}</h1>
      </div>
      <div style={{ padding: "20px" }}>
        <p>Hello {name},</p>
        <div dangerouslySetInnerHTML={{ __html: notificationBody }} />
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
            Visit Movie Platform
          </a>
        </div>
        <p>If you have any questions or need assistance, please contact our support team.</p>
        <p>Best regards,</p>
        <p>The Movie Platform Team</p>
      </div>
      <div
        style={{ backgroundColor: "#f8f9fa", padding: "20px", textAlign: "center", fontSize: "12px", color: "#666" }}
      >
        <p>© {new Date().getFullYear()} Movie Platform. All rights reserved.</p>
        <p>You received this email because you have notifications enabled for your account.</p>
        <p>
          <a href={`${process.env.NEXT_PUBLIC_APP_URL}/settings/notifications`} style={{ color: "#0070f3" }}>
            Manage notification settings
          </a>
        </p>
      </div>
    </div>
  )
}

