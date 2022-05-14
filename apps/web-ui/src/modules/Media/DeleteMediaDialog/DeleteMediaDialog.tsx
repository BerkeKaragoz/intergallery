import { MediaDTO } from "@/modules/Media/utils";
import { useDeleteMediaMutation } from "@/redux/slice/mediaApiSlice";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";

const confirmationSchema = Yup.object({
  confirmation: Yup.string()
    .default("")
    .required("You must type 'delete' to delete!")
    .oneOf(["delete", null], "You must type 'delete' to delete!"),
});

type Props = {
  cancelHandler?: () => void;
  media: MediaDTO;
};

const DeleteMediaDialog: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { cancelHandler = () => {}, media } = props;

  const [deleteMedia, { isLoading }] = useDeleteMediaMutation();

  return (
    <div>
      <Formik
        initialValues={confirmationSchema.getDefault()}
        validationSchema={confirmationSchema}
        validateOnMount={true}
        validateOnChange={true}
        onSubmit={(value) => {
          deleteMedia(media.id)
            .then((res) => {
              cancelHandler();
              navigate("/");
            })
            .catch((err) => {
              console.error("Failed to delete the media!", err);
            });
        }}
      >
        {({ errors, touched, isValid }) => (
          <Form>
            <DialogTitle>Delete Media</DialogTitle>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="body1">
                If you are sure to delete this media, please type '
                <b>
                  <code>delete</code>
                </b>
                '.
              </Typography>
              <Field
                as={TextField}
                required
                name="confirmation"
                aria-label="Confirmation"
                placeholder="delete"
                variant="standard"
                fullWidth
                autoComplete="off"
                spellCheck="true"
                helperText={<ErrorMessage name="confirmation" />}
                error={
                  touched["confirmation"] && Boolean(errors["confirmation"])
                }
              />
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={cancelHandler}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" disabled={!isValid}>
                Delete
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DeleteMediaDialog;
