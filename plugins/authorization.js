import fp from 'fastify-plugin'
import Jwt from '@fastify/jwt'
import Cookie from '@fastify/cookie'
import Csrf from '@fastify/csrf-protection'
import { Client } from 'undici'

async function authorization(fastify, opts) {
  const { config } = fastify

  // We use the `fastify-jwt` plugin to generate a JWT
  fastify.register(Jwt, {
    secret: config.JWT_SECRET,
    cookie: {
      cookieName: 'user_session',
      signed: true,
    },
  })

  // `fastify-cookie` adds everything you need to work with cookies
  fastify.register(Cookie, {
    secret: config.COOKIE_SECRET,
  })

  // When using sessions with cookies, it's always recommended to use CSRF.
  // `fastify-csrf` will help you better protect your application.
  fastify.register(Csrf, {
    sessionPlugin: '@fastify/cookie',
    cookieOpts: { signed: true },
  })

  fastify.decorate('authorize', authorize)

  async function authorize(req, reply) {
    try {
      await req.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  }
}

// When exporting a plugin that exposes a utility that will need to be used
// in other parts of your application, use `fastify-plugin` to tell Fastify that
// this plugin should not be encapsulated. See https://www.fastify.io/docs/latest/Encapsulation/.
export default fp(authorization, {
  // Protip: if you name your plugins, the stack trace in case of errors
  //         will be easier to read and other plugins can declare their dependency
  //         on this one. `fastify-autoload` will take care of loading the plugins
  //         in the correct order.
  name: 'authorization',
})
