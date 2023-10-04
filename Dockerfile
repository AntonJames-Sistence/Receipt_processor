# Use the official Go image as the base image
FROM golang:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the Go application source code to the container
COPY . .

# Build the Go application inside the container
RUN go build -o app .

# Expose port 8080
EXPOSE 8080

# Command to run the Go application
CMD ["./app"]