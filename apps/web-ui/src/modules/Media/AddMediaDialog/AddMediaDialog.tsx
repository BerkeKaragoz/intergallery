import LoadingButton from "@/components/LoadingButton";
import {
  CreateMediaInputDTO,
  lengthMediaType,
  MediaType,
} from "@/modules/Media/utils";
import { usePostMediaMutation } from "@/redux/slice/mediaApiSlice";
import {
  Checkbox,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { FastField, FieldArray, Form, Formik } from "formik";
import * as React from "react";
import * as Yup from "yup";

const mediaSchema = Yup.object({
  Name: Yup.string().default("").max(100),
  URL: Yup.string().default("").required().max(300),
  "Is Local": Yup.boolean().default(true).required(),
  Type: Yup.number()
    .default(MediaType.UNKNOWN)
    .min(0)
    .max(lengthMediaType)
    .default(0),
});

const addMediaSchema = Yup.object({
  "Root URL": Yup.string().default(""),
  media: Yup.array(mediaSchema)
    .default([mediaSchema.getDefaultFromShape()])
    .min(1, "Minimum 1 source is required!"),
});

type Props = {
  cancelHandler?: () => void;
  initialMedia?: Partial<ReturnType<typeof addMediaSchema.getDefault>>["media"];
};

const AddMediaDialog: React.FC<Props> = (props) => {
  const { cancelHandler = () => {}, initialMedia = [] } = props;

  const [postMedia, { isLoading }] = usePostMediaMutation();

  return (
    <Formik
      initialValues={{
        ...addMediaSchema.getDefaultFromShape(),
        media: [
          ...(initialMedia.length === 0
            ? addMediaSchema.getDefaultFromShape().media
            : initialMedia),
        ],
      }}
      validationSchema={addMediaSchema}
      validateOnMount={true}
      validateOnChange={false}
      onSubmit={(values, { resetForm }) => {
        const inputArr: CreateMediaInputDTO[] = [];

        // trim whitespace and /
        const trimmedRootUrl = values["Root URL"]
          .trim()
          .replace(/^\/+|\/+$/g, "");

        const rootUrl = trimmedRootUrl + (trimmedRootUrl.length > 0 ? "/" : "");

        for (const el of values.media) {
          console.log(el);
          inputArr.push({
            name: el.URL,
            sources: [
              {
                url: rootUrl + el.URL,
                isLocal: el["Is Local"],
              },
            ],
            type: el.Type,
          });
        }

        postMedia(inputArr)
          .then((res) => {
            cancelHandler();
          })
          .catch((err) => {
            console.error("Failed to add the media.", err);
          });
      }}
    >
      {({ errors, isValid, values, submitForm, resetForm }) => (
        <>
          <DialogTitle>Add Media</DialogTitle>
          <DialogContent>
            <Form>
              <FastField
                as={TextField}
                name="Root URL"
                label="Root URL"
                placeholder="/"
                variant="standard"
                fullWidth
                autoComplete="off"
                spellCheck="false"
                //@ts-ignore undefined is expected anyway
                error={Boolean(errors["Root URL"])}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
              <FieldArray name="media">
                {({ remove, push }) => (
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>URL</TableCell>
                        <TableCell align="center" padding="checkbox">
                          Local
                        </TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right" size="small" padding="none">
                          <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            aria-label="Add Media"
                            size="small"
                            onClick={() => {
                              push(mediaSchema.getDefaultFromShape());
                            }}
                          >
                            +
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.media.map((m, index) => (
                        <TableRow
                          key={`media-entry-${index}`}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <FastField
                              as={TextField}
                              name={`media.${index}.Name`}
                              aria-label="Name"
                              placeholder="Name"
                              variant="standard"
                              fullWidth
                              autoComplete="off"
                              spellCheck="false"
                            />
                          </TableCell>
                          <TableCell>
                            <FastField
                              as={TextField}
                              name={`media.${index}.URL`}
                              aria-label="URL"
                              placeholder="URL *"
                              variant="standard"
                              required
                              fullWidth
                              autoComplete="off"
                              spellCheck="false"
                              //@ts-ignore undefined is expected anyway
                              error={Boolean(errors?.media?.[index]?.URL)}
                            />
                          </TableCell>
                          <TableCell align="center" padding="checkbox">
                            <FastField
                              as={Checkbox}
                              defaultChecked
                              name={`media.${index}.Is Local`}
                              label="Is Local"
                            />
                          </TableCell>
                          <TableCell>
                            <FastField
                              as={Select}
                              fullWidth
                              size="small"
                              label="Type"
                              name={`media.${index}.Type`}
                              variant="standard"
                            >
                              {Array.from({ length: lengthMediaType }).map(
                                (_, i) => (
                                  <MenuItem
                                    key={`media-menuItem-${i}`}
                                    value={i}
                                  >
                                    {MediaType[i]}
                                  </MenuItem>
                                ),
                              )}
                            </FastField>
                          </TableCell>
                          <TableCell align="right" size="small" padding="none">
                            <Button
                              fullWidth
                              aria-label="Remove Media"
                              size="small"
                              variant="outlined"
                              onClick={() => remove(index)}
                            >
                              X
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </FieldArray>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelHandler}>Cancel</Button>
            <LoadingButton
              type="submit"
              variant="contained"
              onClick={(e) => {
                submitForm();
              }}
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              Add
            </LoadingButton>
          </DialogActions>
        </>
      )}
    </Formik>
  );
};

export type { Props as AddMediaDialogProps };
export default AddMediaDialog;
