import { Button } from "@/components/atoms/button";
import { TextInput } from "@/components/atoms/text-input/text-input";
import Text from "@/components/atoms/text/text-ui";
import useSubmittedError from "@/hooks/useSubmittedError";
import {
  ForgotPasswordRequest,
  forgotPasswordRequestSchema,
} from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const submittedError = useSubmittedError({
    isSubmitted,
    errors,
  });

  const onSubmit = (data: ForgotPasswordRequest) => {
    console.log(data);
  };

  return (
    <>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              errorText={submittedError.email?.message}
            />
          )}
        />
      </View>

      <View style={styles.signupBtnContainer}>
        <View style={{ width: "100%" }}>
          <Button onPress={handleSubmit(onSubmit)}>Send reset link</Button>
        </View>

        <View style={styles.loginContainer}>
          <Text>Remembered your password?</Text>
          <Link href="/signin">
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
