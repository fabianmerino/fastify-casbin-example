import fp from 'fastify-plugin'
import Mongodb from '@fastify/mongodb'

const MongoPlugin = fp(
  async (fastify, opts) => {
    const { config } = fastify
    fastify.register(Mongodb, {
      forceClose: true,
      url: config.MONGODB_URL,
    })
  },
  {
    name: 'mongo',
  }
)

export default MongoPlugin
