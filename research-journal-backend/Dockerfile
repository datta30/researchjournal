# syntax=docker/dockerfile:1

FROM maven:3.9.9-eclipse-temurin-21 AS build

# Update CA certificates to fix SSL issues
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

WORKDIR /workspace

# Copy pom and source code
COPY pom.xml ./
COPY src src

# Build the jar
RUN mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Render exposes PORT, default to 8081 for local use
ENV PORT=8081

# Copy the fat jar built in the previous stage
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java","-jar","app.jar"]
