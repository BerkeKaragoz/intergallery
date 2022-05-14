import AppLink from "@/components/AppLink";
import { useAppDispatch } from "@/redux/hooks";
import { fetchLoginUser } from "@/redux/slice/userSlice";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import {
  Button,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { REGISTER_HASH } from "@/modules/Auth/utils";
import LoadingButton from "@/components/LoadingButton";

const loginFormSchema = Yup.object({
  username: Yup.string().default("").required(),
  password: Yup.string().default("").required(),
});

const LoginBox = () => {
  const dispatch = useAppDispatch();

  return (
    <Stack spacing={4} sx={{ textAlign: "center" }}>
      <Box mb={-2}>
        <Typography variant="h5" component="h1" mb={1}>
          Login
        </Typography>
        <Typography variant="subtitle1" component="p">
          Welcome! Login to access Intergallery.
        </Typography>
      </Box>
      <Formik
        initialValues={loginFormSchema.getDefault()}
        validationSchema={loginFormSchema}
        onSubmit={(values) => {
          dispatch(fetchLoginUser(values)).finally(() => {});
        }}
        validateOnMount={true}
      >
        {({ errors, isValid, isSubmitting }) => (
          <Form>
            <Stack spacing={4}>
              <Field
                as={TextField}
                name="username"
                label="Username"
                required
                autoComplete="off"
                spellCheck="false"
                //helperText={<ErrorMessage name="username" />}
                //error={Boolean(errors.username)}
              />
              <Field
                as={TextField}
                type="password"
                name="password"
                label="Password"
                required
                autoComplete="off"
                spellCheck="false"
                //helperText={<ErrorMessage name="password" />}
                //error={Boolean(errors.password)}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Link href="/forgot-password" variant="caption">
                  Forgot Password?
                </Link>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  color="secondary"
                  disabled={!isValid}
                  endIcon={<KeyboardTabIcon />}
                  isLoading={isSubmitting}
                >
                  Continue
                </LoadingButton>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
      <Box sx={{ display: "flex", "& > span": { lineHeight: "13px" } }}>
        <Divider
          sx={{
            flexShrink: 1,
            width: "100%",
            mr: 2,
            alignSelf: "center",
          }}
        />
        <span>or</span>
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Button
          component={AppLink}
          href={REGISTER_HASH}
          variant="contained"
          endIcon={<AppRegistrationIcon />}
        >
          Sign up
        </Button>
      </Box>
    </Stack>
  );
};

export default LoginBox;
