# Use the official Golang image to build the Go application
FROM golang:1.18-alpine AS build

# Set the current working directory inside the container
WORKDIR /app

# Copy the Go module files
COPY go.mod ./
COPY go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code to the container
COPY . .

# Build the Go app
RUN go build -o scraper main.go

# Start a new stage from scratch
FROM alpine:latest

# Copy the Go app from the build container
COPY --from=build /app/scraper /scraper

# Command to run the Go app
ENTRYPOINT ["/scraper"]
