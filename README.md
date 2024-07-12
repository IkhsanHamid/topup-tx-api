Store API 
------------------------

## Project Specification

* Using typescript for programming language
* Express js for framework
* MongoDB for database
* Using vercel for deployment system

## Flow create an API 

* if don't have models, create a model in folder src/models.
* if have models and completed created models :
  - first create a function service in models which you need, you can check in folder src/services
  - and then you can create types and validation in folder src/validations and src/types
  - and then create a function in the controller, src/controller.
  - after that declare your API routes in routes model and in index.js, src/routes

* if have completely created API and then don't forget add docs in swagger in apidocs.json

## Flow commit with husky
```npm run format``` -> ```npm run check-types``` -> ```npm run check-format``` -> ```npm run check-lint```

## Note
* if you create an utils etc, don't forget give the docs in the code, so that the code can be understood if other used the code.
* Node Version: v18(LTS)
* default port: 3100

## Endpoint 

```https://dev-api-project.vercel.app/api```


thanks,
ikhsan