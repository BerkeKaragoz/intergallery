import AppLink from "@/components/AppLink"
import LoadingButton from "@/components/LoadingButton"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchRegisterUser } from "@/redux/slice/userSlice"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab"
import {
   Button,
   IconButton,
   InputAdornment,
   Stack,
   TextField,
   Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import { ErrorMessage, Field, Form, Formik } from "formik"
import React from "react"
import * as Yup from "yup"

const registerFormSchema = Yup.object({
   Username: Yup.string().default("").min(3).required(),
   Password: Yup.string().default("").min(7).required(),
   "Confirm Password": Yup.string()
      .default("")
      .min(7)
      .required()
      .oneOf([Yup.ref("Password"), null], "Passwords must match"),
})

const RegisterBox = () => {
   const dispatch = useAppDispatch()
   const userState = useAppSelector((state) => state.user)

   const [isShowingPassword, setIsShowingPassword] = React.useState(false)

   return (
      <Stack spacing={4} sx={{ textAlign: "center" }}>
         <Box mb={-2}>
            <Typography variant="h5" component="h1" mb={1}>
               Sign Up
            </Typography>
            <Typography variant="subtitle1" component="p">
               Welcome! It's simple and fast.
            </Typography>
            {userState.error && (
               <Typography variant="subtitle2" color="error" component="p">
                  {userState.error}
               </Typography>
            )}
         </Box>
         <Formik
            initialValues={registerFormSchema.getDefault()}
            validationSchema={registerFormSchema}
            onSubmit={(values) => {
               dispatch(
                  fetchRegisterUser({
                     username: values.Username,
                     password: values.Password,
                  })
               )
            }}
            validateOnMount={true}
         >
            {({ errors, isValid, isSubmitting, touched }) => (
               <Form>
                  <Stack spacing={3}>
                     <Field
                        as={TextField}
                        name="Username"
                        label="Username"
                        required
                        autoComplete="off"
                        spellCheck="false"
                        helperText={<ErrorMessage name="Username" />}
                        error={touched.Username && Boolean(errors.Username)}
                     />
                     <Field
                        as={TextField}
                        type={isShowingPassword ? "text" : "password"}
                        name="Password"
                        label="Password"
                        required
                        autoComplete="off"
                        spellCheck="false"
                        helperText={<ErrorMessage name="Password" />}
                        error={touched.Password && Boolean(errors.Password)}
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="end">
                                 <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setIsShowingPassword((s) => !s)}
                                    edge="end"
                                 >
                                    {isShowingPassword ? (
                                       <VisibilityOff />
                                    ) : (
                                       <Visibility />
                                    )}
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />
                     <Field
                        as={TextField}
                        type={isShowingPassword ? "text" : "password"}
                        name="Confirm Password"
                        label="Confirm Password"
                        required
                        autoComplete="off"
                        spellCheck="false"
                        helperText={<ErrorMessage name="Confirm Password" />}
                        error={
                           touched["Confirm Password"] &&
                           Boolean(errors["Confirm Password"])
                        }
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="end">
                                 <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setIsShowingPassword((s) => !s)}
                                    edge="end"
                                 >
                                    {isShowingPassword ? (
                                       <VisibilityOff />
                                    ) : (
                                       <Visibility />
                                    )}
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />
                     <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                     >
                        <Button
                           component={AppLink}
                           href="#"
                           color="secondary"
                           variant="outlined"
                        >
                           I have an account
                        </Button>
                        <LoadingButton
                           variant="contained"
                           type="submit"
                           disabled={!isValid}
                           endIcon={<KeyboardTabIcon />}
                           isLoading={isSubmitting}
                        >
                           Sign Up
                        </LoadingButton>
                     </Stack>
                  </Stack>
               </Form>
            )}
         </Formik>

         <Typography variant="caption" align="right">
            By clicking Sign Up, you agree to our Terms, Data Policy and Cookie
            Policy.
         </Typography>
      </Stack>
   )
}

export default RegisterBox
