import fp from 'fastify-plugin'
import Casbin from 'fastify-casbin'
import { MongooseAdapter } from 'casbin-mongoose-adapter'
import fastifyCasbinRest from 'fastify-casbin-rest'

export default fp(
  async (fastify, opts) => {
    const { config } = fastify
    const adapter = await MongooseAdapter.newAdapter(config.MONGODB_URL)
    fastify.register(Casbin, {
      model: 'config/basic_model.conf', // the model configuration
      adapter, // the adapter
    })

    fastify.register(fastifyCasbinRest, {
      getSub: (r) => r.user.username,
    })

    fastify.addHook('onReady', async function () {
      await fastify.casbin.addPolicy('*', '/_app', '(GET)|(POST)')
    })
  },
  {
    name: 'casbin',
  }
)
