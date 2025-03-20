export function NewMovieEmailTemplate({
  username = "Movie Fan",
  movieTitle = "Inception",
  movieImage = "https://vidoe.com/movies/inception.jpg",
  movieDescription = "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  movieUrl = "https://vidoe.com/movies/inception",
}: {
  username?: string
  movieTitle?: string
  movieImage?: string
  movieDescription?: string
  movieUrl?: string
}) {
  return (
    <div
      style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px", color: "#333" }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src="https://vidoe.com/textAlign: 'center', marginBottom: '20px'}}>
        <img 
          src="
          https:alt="Vidoe Logo" //vidoe.com/logo.png"
          style={{ height: "50px" }}
        />
      </div>

      <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "5px" }}>
        <h1 style={{ color: "#e11d48", marginBottom: "20px" }}>New Movie Release: {movieTitle}</h1>

        <p>Hello {username},</p>

        <p>We're excited to announce that a new movie has been added to our collection!</p>

        <div
          style={{
            display: "flex",
            margin: "20px 0",
            borderRadius: "5px",
            overflow: "hidden",
            border: "1px solid #ddd",
          }}
        >
          <div style={{ width: "150px", flexShrink: 0 }}>
            <img src={movieImage || "/placeholder.svg"} alt={movieTitle} style={{ width: "100%", height: "auto" }} />
          </div>
          <div style={{ padding: "15px" }}>
            <h2 style={{ color: "#e11d48", marginTop: 0 }}>{movieTitle}</h2>
            <p>{movieDescription}</p>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={movieUrl}
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
            Watch Now
          </a>
        </div>

        <p>Don't miss out on this amazing film! Add it to your watchlist today.</p>

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
          </a>{" "}
          |
          <a href="https://vidoe.com/unsubscribe" style={{ color: "#666", textDecoration: "underline" }}>
            Unsubscribe
          </a>
        </p>
      </div>
    </div>
  )
}

