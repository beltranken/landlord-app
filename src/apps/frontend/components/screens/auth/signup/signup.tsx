import { signUp } from "@/api/sdk.gen";
import AlertModal from "@/components/atoms/alert/alert";
import { Button } from "@/components/atoms/button/button";
import Loading from "@/components/atoms/loading/loading";
import { PasswordInput } from "@/components/atoms/password-input/password-input";
import { TextInput } from "@/components/atoms/text-input/text-input";
import Text from "@/components/atoms/text/text-ui";
import useSubmittedError from "@/hooks/useSubmittedError";
import { RegisterRequest, registerRequestSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

export default function SignupScreen() {
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (param: RegisterRequest) => {
      const { data, error } = await signUp({
        body: {
          ...param,
          dateOfBirth: undefined,
        },
      });

      if (error) {
        console.log(error);
        setError("root", {
          type: "server",
          message: "Unable to sign up. Please try again.",
        });
      }

      return data;
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitted },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: undefined,
    },
  });

  const submittedError = useSubmittedError({
    isSubmitted,
    errors,
  });

  const onSubmit = (data: RegisterRequest) => {
    mutate(data);
  };

  const onError: SubmitErrorHandler<RegisterRequest> = (error) => {
    console.log(error);
  };

  const handleOnSuccess = () => {
    router.push("/signup");
  };

  return (
    <>
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="First Name"
              value={value}
              onChangeText={onChange}
              errorText={submittedError.firstName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Last Name"
              value={value}
              onChangeText={onChange}
              errorText={submittedError.lastName?.message}
            />
          )}
        />

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

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              placeholder="Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              errorText={submittedError.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <PasswordInput
              placeholder="Confirm Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              errorText={submittedError.confirmPassword?.message}
            />
          )}
        />
      </View>

      <View style={styles.signupBtnContainer}>
        {submittedError.root && (
          <Text style={{ color: "red", marginBottom: 8 }}>
            {submittedError.root.message}
          </Text>
        )}

        <View style={{ width: "100%" }}>
          <Button onPress={handleSubmit(onSubmit, onError)}>Sign Up</Button>
        </View>

        <View style={styles.loginContainer}>
          <Text>Already have an account?</Text>
          <Link href="/signup">
            <Text style={styles.loginText}>Login</Text>
          </Link>
        </View>
      </View>

      <Loading visible={isPending} />

      <AlertModal
        visible={isSuccess}
        message="Sign up successful! You can now log in with your new account."
        buttonLabel="Go to login"
        onPress={handleOnSuccess}
      />
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
