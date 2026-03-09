import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginResponseSchema, loginSchema } from "@validations/auth";
import { login } from "@backend/services/auth";

export const authPlugin: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.register(import("@fastify/jwt"), {
    secret: fastify.config.JWT_SECRET,
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        body: loginSchema,
        response: {
          200: loginResponseSchema,
        },
      },
    },
    async (req, reply) =>
      await login(fastify, req.body.email, req.body.password),
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/register",
    {
      schema: {
        body: loginSchema,
      },
    },
    async (req, reply) => {
      /* const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); */
      // Save user to DB
      reply.send({ message: "User registered" });
    },
  );

  done();
};
