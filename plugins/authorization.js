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

export default fp(authorization, {
  name: 'authorization',
})
