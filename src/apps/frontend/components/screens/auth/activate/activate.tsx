import { TextInput } from "@/components/atoms/text-input/text-input";
import Text from "@/components/atoms/text/text-ui";
import useSubmittedError from "@/hooks/useSubmittedError";
import { ActivateRequest, activateRequestSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function ActivateScreen() {
  const { token } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<ActivateRequest>({
    resolver: zodResolver(activateRequestSchema),
    defaultValues: {
      token: "",
    },
  });

  useEffect(() => {
    if (token) {
      setValue("token", String(token));
    } else {
      setError("token", { type: "manual", message: "Token is required" });
    }
  }, [token]);

  const submittedError = useSubmittedError({
    isSubmitted,
    errors,
  });

  const onSubmit = (data: ActivateRequest) => {
    console.log(data);
  };

  return (
    <>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="token"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Activation code"
              value={value}
              onChangeText={onChange}
              errorText={submittedError.token?.message}
            />
          )}
        />
      </View>

      <View style={styles.signupBtnContainer}>
        <View style={styles.loginContainer}>
          <Text>Already activated?</Text>
          <Link href="/login">
            <Text style={styles.loginText}>Login</Text>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 16,
  },
  signupBtnContainer: {
    gap: 8,
    alignItems: "center",
  },
  loginContainer: {
    flexDirection: "row",
    gap: 4,
  },
  loginText: {
    color: "#783D10",
    fontWeight: "500",
  },
});
