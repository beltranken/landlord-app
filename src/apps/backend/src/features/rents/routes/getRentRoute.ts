import formatResult, { FormatResult } from "@backend/utils/formatResult";
import type { Rent } from "@db/types";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getRent } from "../services/index";

type GetRentRoute = {
  Reply: FormatResult<Rent>;
  Params: {
    rentId: number;
  };
};

export function getRentRoute(fastify: FastifyInstance) {
  return async (
    req: FastifyRequest<GetRentRoute>,
    reply: FastifyReply<GetRentRoute>,
  ) => {
    const { rentId } = req.params;

    const rent = await getRent(fastify, {
      organizationId: req.user.organizationId,
      rentId,
    });

    reply.status(200).send(formatResult(rent));
  };
}
