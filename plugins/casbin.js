import { MongooseAdapter } from 'casbin-mongoose-adapter'
import Casbin from 'fastify-casbin'
import fp from 'fastify-plugin'

export default fp(
  async (fastify, opts) => {
    const mongooseOpts = {
      user: 'root',
      pass: 'example',
    }
    const adapter = await MongooseAdapter.newAdapter('mongodb://root:example@localhost:27017')
    fastify.register(Casbin, {
      model: 'basic_model.conf', // the model configuration
      adapter, // the adapter
    })
  },
  {
    name: 'casbin',
  }
)
