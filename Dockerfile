# Stage 1: Compile and build Vue app

# Use official node image as the base image
FROM node:18-alpine as build

RUN apk --update add openjdk8-jre

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app

# Install all dependencies
RUN npm ci --quiet

# Generate the build of the application
RUN npm run build


# Stage 2: Serve app

# Lightweight http server written in Go
FROM pierrezemb/gostatic:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist /srv/http

# Expose port 8043
EXPOSE 8043
