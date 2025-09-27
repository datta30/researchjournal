# syntax=docker/dockerfile:1

FROM maven:3.9.7-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy pom and resolve dependencies first to leverage Docker layer caching
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the actual source and build the jar
COPY src src
RUN mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Render exposes PORT, default to 8081 for local use
ENV PORT=8081

# Copy the fat jar built in the previous stage
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java","-jar","app.jar"]
