import fp from 'fastify-plugin'
import mongoose from 'mongoose'
import fastifyFormBody from '@fastify/formbody'
import fastifyMongooseAPI from 'fastify-mongoose-api'
import models from '../models/index.js'

// connection.useDb(env.MONGODB_DB)

const MongoPlugin = fp((fastify, opts, next) => {
  const { config } = fastify
  const connection = mongoose.createConnection(config.MONGODB_URL)

  connection.model('User', models.UserSchema)

  fastify.register(fastifyFormBody)
  fastify.register(fastifyMongooseAPI, {
    models: connection.models, /// Mongoose connection models
    prefix: '/api/', /// URL prefix. e.g. http://localhost/api/...
    setDefaults: true, /// you can specify your own api methods on models, our trust our default ones, check em [here](https://github.com/jeka-kiselyov/fastify-mongoose-api/blob/master/src/DefaultModelMethods.js)
    methods: ['list', 'get', 'post', 'patch', 'put', 'delete', 'options'],
  })
  fastify.decorate('mongo', connection)

  next()
})

export default MongoPlugin
