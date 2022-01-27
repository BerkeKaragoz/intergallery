import Main from "@/components/Main";
import { useAppDispatch } from "@/redux/hooks";
import { fetchLoginUser } from "@/redux/slice/userSlice";
import {
  Button,
  Container,
  Divider,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";

const loginFormSchema = Yup.object({
  username: Yup.string().default("").min(2).required(),
  password: Yup.string().default("").min(3).required(),
});

const LoginForm = () => {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={loginFormSchema.getDefault()}
      validationSchema={loginFormSchema}
      onSubmit={(values) => {
        dispatch(fetchLoginUser(values));
      }}
      validateOnMount={true}
    >
      {({ errors, isValid }) => (
        <Form>
          <Stack spacing={4}>
            <Field
              as={TextField}
              name="username"
              label="Username"
              required
              autoComplete="off"
              spellCheck={false}
              helperText={<ErrorMessage name="username" />}
              error={Boolean(errors.username)}
            />
            <Field
              as={TextField}
              type="password"
              name="password"
              label="Password"
              required
              autoComplete="off"
              spellCheck={false}
              helperText={<ErrorMessage name="password" />}
              error={Boolean(errors.password)}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Link href="/forgot-password" variant="caption">
                Forgot Password?
              </Link>
              <Button
                variant="contained"
                type="submit"
                color="secondary"
                disabled={!isValid}
                endIcon={<KeyboardTabIcon />}
              >
                Continue
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

const AuthPage = () => {
  return (
    <Box component="main">
      <Box
        sx={{
          width: "80%",
          height: "80vh",
          minHeight: "512px",
          backgroundImage: 'url("/assets/kaung-myat-halfblurred-min.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 3,
          boxShadow: "0px 4px 24px 12px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
          zIndex: "-1",
          transform: "translate(-50%, -55%)",
          position: "absolute",
          top: "50%",
          left: "50%",
          "@media screen and (max-height: 500px)": {
            position: "fixed",
            transform: "translate(-50%, -50%)",
            margin: 0,
            borderRadius: 0,
            width: "100%",
            height: "100%",
          },
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 100,
            fontSize: "4rem",
            opacity: 0.8,
            letterSpacing: "0.1rem",
            mt: 8,
            "@media screen and (max-height: 648px)": {
              visibility: "hidden",
            },
            "@media screen and (max-width: 500px)": {
              fontSize: "2rem",
            },
          }}
        >
          Intergallery
        </Typography>
      </Box>
      <Paper
        sx={[
          {
            borderRadius: 2,
            maxWidth: "512px",
            minWidth: "275px",
            width: "99%",
            border: 1,
            borderColor: "primary.main",
            boxShadow: "0px 20px 24px 12px rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            py: 6,
            px: 2,
            "@media screen and (max-height: 500px)": {
              position: "static",
              transform: "translate(0,0)",
              margin: "auto",
              borderRadius: 0,
              borderTop: "1px solid #fff0",
              borderBottom: "1px solid #fff0",
              minHeight: "100vh",
            },
          },
          (theme) => ({
            backgroundColor: `${theme.palette.background.paper}EE`,
            "@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))":
              {
                backgroundColor: `${theme.palette.background.paper}DD`,
                backdropFilter: "blur(8px)",
              },
          }),
        ]}
      >
        <Container maxWidth="xs">
          <Stack spacing={4} sx={{ textAlign: "center" }}>
            <Box mb={-2}>
              <Typography variant="h5" component="h1" mb={1}>
                Login
              </Typography>
              <Typography variant="subtitle1" component="p">
                Welcome! Login to access Intergallery.
              </Typography>
            </Box>
            <LoginForm />

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
              <Button variant="contained" endIcon={<AppRegistrationIcon />}>
                Sign up
              </Button>
            </Box>
          </Stack>
        </Container>
      </Paper>
    </Box>
  );
};

export default AuthPage;
