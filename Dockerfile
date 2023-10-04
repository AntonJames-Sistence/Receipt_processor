# Use a specific Go version as the base image
FROM golang:1.21.1

# Set the working directory inside the container
WORKDIR /app

# Copy the Go application source code and dependency files to the container
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy the rest of the application source code to the container
COPY . .

# Build the Go application inside the container
RUN go build -o app .

# Expose port 8080
EXPOSE 8080

# Command to run the Go application
CMD ["./app"]
