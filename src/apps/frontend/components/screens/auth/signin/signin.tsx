import { signIn } from "@/api/sdk.gen";
import { Button } from "@/components/atoms/button";
import { Divider } from "@/components/atoms/divider/divider";
import Loading from "@/components/atoms/loading/loading";
import { PasswordInput } from "@/components/atoms/password-input/password-input";
import { TextH2 } from "@/components/atoms/text";
import { TextInput } from "@/components/atoms/text-input/text-input";
import Text from "@/components/atoms/text/text-ui";
import { Colors, Sizes } from "@/constants";
import useSubmittedError from "@/hooks/useSubmittedError";
import { useAuth } from "@/providers/auth-provider";
import { LoginRequest, loginRequestSchema, LoginResponse } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function SignInScreen() {
  const { setAuthData } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: async (param: LoginRequest) => {
      const { data: responseData, error } = await signIn({
        body: param,
      });

      let data: LoginResponse["data"] | undefined;
      if (error || !responseData) {
        console.log(responseData);
        console.log(error);
        setError("root", {
          message: error?.message ?? "An error occurred during login",
        });
      } else {
        data = responseData.data;
      }

      setAuthData(data);
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitted },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "test@beltrankenhenson.com",
      password: "Password123!",
    },
  });

  const submittedError = useSubmittedError({
    isSubmitted,
    errors,
  });

  const onSubmit = (data: LoginRequest) => {
    mutate(data);
  };

  return (
    <>
      <View style={styles.formContainer}>
        <View>
          <TextH2>Welcome back</TextH2>

          <Text>Please enter your credentials to continue asdasd.</Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="email address"
              placeholder="user@gmail.com"
              value={value}
              onChangeText={onChange}
              errorText={submittedError.email?.message}
            />
          )}
        />

        <View style={styles.passwordContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <PasswordInput
                label="password"
                placeholder="********"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorText={submittedError.password?.message}
              />
            )}
          />

          <View style={styles.forgotContainer}>
            <Link href="/">
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Link>
          </View>
        </View>
      </View>

      <View style={styles.loginBtnContainer}>
        {submittedError.root && (
          <Text style={styles.errorText}>{submittedError.root.message}</Text>
        )}

        <View style={{ width: "100%" }}>
          <Button onPress={handleSubmit(onSubmit)}>Login</Button>
        </View>

        <View style={styles.signupContainer}>
          <Text>Don't have an account?</Text>
          <Link href="/signup">
            <Text style={styles.forgotText}>Sign up</Text>
          </Link>
        </View>
      </View>

      <Divider label="OR" />

      <Loading visible={isPending} />
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: Sizes.padding * 1.5,
  },
  passwordContainer: {},
  forgotContainer: {
    alignItems: "flex-end",
  },
  forgotText: {
    color: "#783D10",
    fontWeight: "500",
  },
  loginBtnContainer: {
    gap: 8,
    alignItems: "center",
  },
  signupContainer: {
    flexDirection: "row",
    gap: 4,
  },
  errorText: {
    color: Colors.textError,
    marginBottom: 8,
  },
});
