import { usePostMediaMutation } from "@/redux/slice/mediaApiSlice";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Field, Form, Formik } from "formik";
import * as React from "react";
import * as Yup from "yup";

const addMediaSchema = Yup.object({
  URL: Yup.string().default("").required(),
  "Is Local": Yup.boolean().default(true).required(),
});

type Props = {
  cancelHandler?: () => void;
  initialValues?: Partial<ReturnType<typeof addMediaSchema.getDefault>>;
};

const AddMediaDialog: React.FC<Props> = (props) => {
  const { cancelHandler = () => {}, initialValues = {} } = props;

  const [postMedia, { isLoading }] = usePostMediaMutation();

  return (
    <Formik
      initialValues={{
        ...addMediaSchema.getDefaultFromShape(),
        ...initialValues,
      }}
      validationSchema={addMediaSchema}
      onSubmit={(values) => {
        postMedia({
          name: values.URL,
          sources: [{ url: values.URL, isLocal: values["Is Local"] }],
        })
          .then((res) => {
            cancelHandler();
          })
          .catch((err) => {
            console.error("Failed to add the media.", err);
          });
      }}
      validateOnMount={true}
    >
      {({ errors, isValid, values }) => (
        <Form>
          <DialogTitle>Add Media</DialogTitle>
          <DialogContent>
            <DialogContentText mb={2}>Enter the source URL.</DialogContentText>
            <Grid
              container
              spacing={4}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={9}>
                <Field
                  as={TextField}
                  name="URL"
                  label="URL"
                  required
                  fullWidth
                  autoComplete="off"
                  spellCheck={false}
                  error={Boolean(errors.URL)}
                />
              </Grid>
              <Grid item>
                <Field
                  as={FormControlLabel}
                  control={<Checkbox defaultChecked />}
                  name="Is Local"
                  label="Is Local"
                  required
                  defaultChecked={values["Is Local"]}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelHandler}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid || isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Add"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export type { Props as AddMediaDialogProps };
export default AddMediaDialog;
