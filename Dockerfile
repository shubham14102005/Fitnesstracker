# Build stage
FROM maven:3.8.8-eclipse-temurin-17 AS build
# Restrict Maven compiler memory to prevent OOM crash during build
ENV MAVEN_OPTS="-XX:+UseSerialGC -Xss512k -XX:MaxRAM=350m"
COPY fitnesstracker /app
WORKDIR /app
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
COPY --from=build /app/target/fitnesstracker-0.0.1-SNAPSHOT.jar /app.jar
EXPOSE 8080
# Limit runtime memory to fit within Render's 512MB free tier container
ENTRYPOINT ["java", "-XX:+UseSerialGC", "-Xss512k", "-XX:MaxRAM=350m", "-jar", "/app.jar"]
