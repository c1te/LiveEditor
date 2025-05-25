# Use official Go 1.24.2 image (Alpine for smaller size)
FROM golang:1.24.2-alpine

# Set working directory inside container
WORKDIR /app

# Copy all project files to container
COPY . .

# Build your Go app
RUN go build -tags netgo -ldflags '-s -w' -o app

# Expose port (optional, your app should use $PORT env)
EXPOSE 8080

# Run the binary
CMD ["./app"]