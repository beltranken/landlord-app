import { ChargeFrequency, RentFrequency } from "@/types";

export type BillingCycleOption = {
  id: number;
  label: string;
};

const toOrdinal = (value: number) => {
  const moduloHundred = value % 100;

  if (moduloHundred >= 11 && moduloHundred <= 13) {
    return `${value}th`;
  }

  const moduloTen = value % 10;

  if (moduloTen === 1) {
    return `${value}st`;
  }

  if (moduloTen === 2) {
    return `${value}nd`;
  }

  if (moduloTen === 3) {
    return `${value}rd`;
  }

  return `${value}th`;
};

export const MONTHLY_BILLING_DAY_OPTIONS: BillingCycleOption[] = Array.from(
  { length: 30 },
  (_, index) => {
    const day = index + 1;

    return {
      id: day,
      label: `${toOrdinal(day)} day of month`,
    };
  },
).concat({
  id: 31,
  label: "Last day of month",
});

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const WEEKLY_BILLING_DAY_OPTIONS: BillingCycleOption[] = WEEK_DAYS.map(
  (day, index) => ({
    id: index + 1,
    label: day,
  }),
);

export const BIWEEKLY_BILLING_DAY_OPTIONS: BillingCycleOption[] = Array.from(
  { length: 14 },
  (_, index) => {
    const day = index + 1;

    return {
      id: day,
      label: `${toOrdinal(day)} day of cycle`,
    };
  },
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const YEARLY_BILLING_DAY_OPTIONS: BillingCycleOption[] = MONTHS.map(
  (month, index) => ({
    id: index + 1,
    label: month,
  }),
);

export const getBillingCycleOptionsForRentFrequency = (
  frequency: RentFrequency,
): BillingCycleOption[] => {
  switch (frequency) {
    case RentFrequency.WEEKLY:
      return WEEKLY_BILLING_DAY_OPTIONS;
    case RentFrequency.BIWEEKLY:
      return BIWEEKLY_BILLING_DAY_OPTIONS;
    case RentFrequency.MONTHLY:
      return MONTHLY_BILLING_DAY_OPTIONS;
    case RentFrequency.YEARLY:
      return YEARLY_BILLING_DAY_OPTIONS;
  }
};

export const getBillingCycleOptionsForChargeFrequency = (
  frequency: ChargeFrequency,
): BillingCycleOption[] => {
  switch (frequency) {
    case ChargeFrequency.ONE_TIME:
      return [];
    case ChargeFrequency.WEEKLY:
      return WEEKLY_BILLING_DAY_OPTIONS;
    case ChargeFrequency.BIWEEKLY:
      return BIWEEKLY_BILLING_DAY_OPTIONS;
    case ChargeFrequency.MONTHLY:
      return MONTHLY_BILLING_DAY_OPTIONS;
    case ChargeFrequency.YEARLY:
      return YEARLY_BILLING_DAY_OPTIONS;
  }
};
