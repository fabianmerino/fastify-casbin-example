import AutoLoad from '@fastify/autoload'
import Sensible from '@fastify/sensible'
import Env from '@fastify/env'
import Cors from '@fastify/cors'
import UnderPressure from '@fastify/under-pressure'
import S from 'fluent-json-schema'
import { join } from 'desm'

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
 * @param {*} opts
 */
export default async function (fastify, opts) {
  // It's very common to pass secrets and configuration
  // to you application via environment variables.
  // The `fastify-env` plugin will expose those configuration
  // under `fastify.config` and validate those at startup.
  fastify.register(Env, {
    schema: S.object()
      .prop('NODE_ENV', S.string().required())
      .prop('JWT_SECRET', S.string())
      .prop('COOKIE_SECRET', S.string())
      .prop('MONGODB_URL', S.string())
      // .prop('ELASTIC_API_KEY', S.string().required())
      // .prop('GITHUB_APP_ID', S.string().required())
      // .prop('GITHUB_APP_SECRET', S.string().required())
      // .prop('COOKIE_SECRET', S.string().required())
      // .prop('ALLOWED_USERS', S.string().required())
      .valueOf(),
  })

  // `fastify-sensible` adds many  small utilities, such as nice http errors.
  fastify.register(Sensible)

  // This plugin is especially useful if you expect an high load
  // on your application, it measures the process load and returns
  // a 503 if the process is undergoing too much stress.
  fastify.register(UnderPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
  })

  // Enables the use of CORS in a Fastify application.
  // https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
  fastify.register(Cors, {
    origin: false,
  })

  // Normally you would need to load by hand each plugin. `fastify-autoload` is an utility
  // we wrote to solve this specific problems. It loads all the content from the specified
  // folder, even the subfolders. Take at look at its documentation, as it's doing a lot more!
  // First of all, we require all the plugins that we'll need in our application.
  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'plugins'),
    options: Object.assign({}, opts),
  })

  // Then, we'll load all of our routes.
  fastify.register(AutoLoad, {
    dir: join(import.meta.url, 'routes'),
    dirNameRoutePrefix: false,
    options: Object.assign({}, opts),
  })

  // Finally, we'll load all of our models.
  fastify.ready(async (err) => {
    if (err) throw err
    fastify.log.info('Fastify is ready!')
    fastify.printRoutes()
  })
}
