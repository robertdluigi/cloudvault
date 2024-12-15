# Stage 1: Build the Go binary
FROM golang:1.28-alpine AS build

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY backend/go.mod backend/go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod tidy

# Copy the source code into the container
COPY backend/ .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Stage 2: Create the smaller final image
FROM alpine:latest

# Install ca-certificates
RUN apk --no-cache add ca-certificates

# Set the Current Working Directory inside the container
WORKDIR /root/

# Copy the Pre-built binary file from the previous image
COPY --from=build /app/main .

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
