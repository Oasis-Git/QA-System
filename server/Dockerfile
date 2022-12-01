FROM openjdk:latest AS backend

ENV TZ=Asia/Shanghai

ENV BACKEND=opt/brace/server
WORKDIR $BACKEND

COPY build.gradle .
COPY gradlew .
COPY settings.gradle .
RUN chmod +x gradlew

COPY gradle gradle
COPY src src
RUN ./gradlew build -x test

ENTRYPOINT ["java", "-jar", "build/libs/server-0.2.1-SNAPSHOT.jar"]
EXPOSE 8080
