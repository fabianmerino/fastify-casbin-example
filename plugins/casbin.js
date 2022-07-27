import fp from 'fastify-plugin'
import Casbin from 'fastify-casbin'
import { MongooseAdapter } from 'casbin-mongoose-adapter'
import fastifyCasbinRest from 'fastify-casbin-rest'

export default fp(
  async (fastify, opts) => {
    const mongooseOpts = {
      dbName: 'culqui',
    }
    const adapter = await MongooseAdapter.newAdapter(
      'mongodb://root:example@localhost:27017',
      mongooseOpts
    )
    fastify.register(Casbin, {
      model: 'basic_model.conf', // the model configuration
      adapter, // the adapter
    })

    fastify.register(fastifyCasbinRest, {
      getSub: (r) => r.user.username,
    })

    fastify.addHook('onReady', async function () {
      await fastify.casbin.addPolicy('alice', 'data1', 'read')
      await fastify.casbin.addPolicy('*', '/_app', '(GET)|(POST)')
    })
  },
  {
    name: 'casbin',
  }
)
