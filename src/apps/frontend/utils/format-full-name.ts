import { Tenant } from "@/types";

export default function formatFullName(
  fullName: Pick<Tenant, "firstName" | "lastName">,
) {
  return `${fullName.firstName} ${fullName.lastName}`;
}
