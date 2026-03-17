import { useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

export default function useSubmittedError<T extends FieldValues>({
  isSubmitted,
  errors,
}: Readonly<{
  isSubmitted: boolean;
  errors: FieldErrors<T>;
}>) {
  const submittedError = useMemo(() => {
    if (isSubmitted) {
      return errors;
    } else {
      return {} as FieldErrors<T>;
    }
  }, [isSubmitted, errors]);

  return submittedError;
}
