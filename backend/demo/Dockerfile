# Stage 1: Build stage
# Changed to JDK 21 to match your project requirements
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom and fetch dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
# Changed to JDK 21 to avoid version errors
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# FIXED: Added the destination path at the end of the line
# Also renamed it to app.jar to make the ENTRYPOINT cleaner
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# FIXED: Pointing to the renamed app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]