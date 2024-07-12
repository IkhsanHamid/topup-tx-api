/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/func-call-spacing */
import 'dotenv/config'
import express, { type Application } from 'express'
import { routes } from './routes'
import { logger } from './config/logger'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'

// swagger
import swaggerUI from 'swagger-ui-express'
import docs from '../apidocs.json'

import deserializedToken from './middleware/deserialirizedToken'
import prisma from './config/prisma'

const app: Application = express()
const port: any = process.env.PORT ?? 3100

// swagger config
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs))

// parse body request
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('uploads'))

// cors access handler
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

app.use(deserializedToken)

routes(app)

// Connect to Prisma and log the connection status
;(async () => {
  try {
    await prisma.connect()
    logger.info('Connected to the database')
    app.listen(port, () => {
      logger.info(`Server is listening on port ${port}`)
    })
  } catch (error) {
    logger.error('Error connecting to the database: ', error)
    process.exit(1)
  }
})()
