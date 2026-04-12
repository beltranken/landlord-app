import { S3Client } from "@aws-sdk/client-s3";
import { Db } from "@db/initDb";
import { UserRole } from "@db/types";
import { FastifyJwtNamespace } from "@fastify/jwt";
import "fastify";

declare module "fastify" {
  interface FastifyInstance extends FastifyJwtNamespace<{
    namespace: "refresh";
  }> {
    config: {
      PORT: string;
      DATABASE_URL: string;
      PINO_LOG_LEVEL: string;
      NODE_ENV: string;
      COOKIE_SECRET: string;
      VERIFY_EMAIL: boolean;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_EXPIRY: string;
      JWT_REFRESH_EXPIRY: string;
      POSTMARK_SERVER_TOKEN: string;
      EMAIL_FROM: string;
      AWS_REGION: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      S3_ENDPOINT: string;
      S3_BUCKET_NAME: string;
    };
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    db: Db;
    s3: S3Client;
  }

  interface FastifyRequest {
    refreshJwtVerify: FastifyRequest["jwtVerify"];
    refreshJwtDecode: FastifyRequest["jwtDecode"];
  }

  interface FastifyReply {
    refreshJwtSign: FastifyReply["jwtSign"];
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: number;
      organizationId: number;
      role: UserRole;
    };
    user: {
      userId: number;
      organizationId: number;
      role: UserRole;
    };
  }

  interface FastifyJWTNamespace {
    refresh: {
      payload: { userId: number };
      user: { userId: number };
    };
  }
}
