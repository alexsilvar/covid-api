# Corona Virus Statistics API
This is a api which webscrap from [Worldometers Coronavirus](https://www.worldometers.info/coronavirus/).
# Deploy & Development
## Heroku
Download Heroku CLI and use the following commands:
```
heroku container:login
heroku container:push --recursive --app=<heroku-app-name>
heroku container:release web --app=<heroku-app-name>
```
## Local Docker
Use the docker-compose to configure your environment. It uses nodemon so you can hotreload your changes.

To start it use
```
docker-compose up -d --build
```

When adding new packages you may have to use this command aggain to reflect it.

# Environment
Configure your MONGODB_URI and PORT in .env file.

