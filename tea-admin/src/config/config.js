const HOST_LOCAL = "http://localhost:5000"
const HOST_PROD = "http://90648d29.ngrok.io" // Production

export const HOST = process.env.NODE_ENV === "development" ? HOST_LOCAL : HOST_PROD

// export const HOST = "https://0c835101.ngrok.io"