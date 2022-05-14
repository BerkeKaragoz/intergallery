import * as Yup from "yup";
import { MediaType, MediaDTO, lengthMediaType } from "@/modules/Media/utils";
import { FastField, FieldArray, Form, Formik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEditMediaMutation } from "@/redux/slice/mediaApiSlice";

const deletedSourceId = Yup.string().default("").required();

const addedSourceSchema = Yup.object({
  url: Yup.string().default(""),
  isLocal: Yup.boolean().default(true).required(),
});

const mediaSchema = Yup.object({
  name: Yup.string().default("").max(100),
  addedSources: Yup.array(addedSourceSchema).default([]),
  deletedSourceIds: Yup.array(deletedSourceId).default([]),
  type: Yup.number()
    .default(MediaType.UNKNOWN)
    .min(0)
    .max(lengthMediaType)
    .default(0),
});

type Props = {
  cancelHandler?: () => void;
  media: MediaDTO;
};

const EditMediaDialog: React.FC<Props> = (props) => {
  const { cancelHandler = () => {}, media } = props;

  const [editMedia, { isLoading }] = useEditMediaMutation();

  return (
    <div>
      <Formik
        initialValues={{
          ...mediaSchema.getDefaultFromShape(),
          ...media,
        }}
        validationSchema={mediaSchema}
        validateOnMount={true}
        validateOnChange={false}
        onSubmit={(value) => {
          editMedia(value)
            .then((res) => {
              cancelHandler();
            })
            .catch((err) => {
              console.error("Failed to edit the media.", err);
            });
        }}
      >
        {({ errors, values }) => (
          <Form>
            <DialogTitle>Edit Media</DialogTitle>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <FastField
                  as={TextField}
                  name="name"
                  aria-label="Name"
                  placeholder="Name"
                  variant="standard"
                  fullWidth
                  autoComplete="off"
                  spellCheck={false}
                />

                <FastField
                  as={Select}
                  fullWidth
                  size="small"
                  label="Type"
                  name="type"
                  variant="standard"
                >
                  {Array.from({ length: lengthMediaType }).map((_, i) => (
                    <MenuItem key={`media-menuItem-${i}`} value={i}>
                      {MediaType[i]}
                    </MenuItem>
                  ))}
                </FastField>
              </Box>
              <FieldArray name="addedSources">
                {({ remove, push }) => (
                  <>
                    <Typography
                      variant="h6"
                      mt={1}
                      sx={{ display: "inline-block", marginRight: 2 }}
                    >
                      Add Sources
                      <Button
                        variant="contained"
                        color="secondary"
                        aria-label="Add Source"
                        size="small"
                        sx={{ marginLeft: 2 }}
                        onClick={() => {
                          push(addedSourceSchema.getDefaultFromShape());
                        }}
                      >
                        +
                      </Button>
                    </Typography>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">#</TableCell>
                          <TableCell>URL</TableCell>
                          <TableCell padding="checkbox">Local</TableCell>
                          <TableCell padding="checkbox" />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {values.addedSources.map((s, i) => (
                          <TableRow key={`${media.id}-added_source-${i}`}>
                            <TableCell padding="checkbox">{i + 1}</TableCell>
                            <TableCell>
                              <FastField
                                as={TextField}
                                name={`addedSources.${i}.url`}
                                aria-label="URL"
                                placeholder="URL *"
                                variant="standard"
                                required
                                fullWidth
                                autoComplete="off"
                                spellCheck={false}
                                //@ts-ignore undefined is expected anyway
                                error={Boolean(errors.URL)}
                              />
                            </TableCell>
                            <TableCell padding="checkbox">
                              <FastField
                                as={Checkbox}
                                defaultChecked
                                name={`addedSources.${i}.isLocal`}
                                label="Is Local"
                              />
                            </TableCell>
                            <TableCell padding="none">
                              <Button
                                variant="outlined"
                                aria-label="Remove Source"
                                size="small"
                                onClick={() => {
                                  remove(i);
                                }}
                              >
                                X
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </FieldArray>
              <Typography variant="h6" mt={1}>
                Remove Sources
              </Typography>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">#</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell padding="checkbox">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {media.sourceIds.map((sourceId, i) => (
                    <TableRow key={`${media.id}-deleted_source-${i}`}>
                      <TableCell padding="checkbox">{i + 1}</TableCell>
                      <TableCell>
                        <TextField
                          disabled
                          aria-label="ID"
                          value={sourceId}
                          variant="standard"
                          fullWidth
                          autoComplete="off"
                          spellCheck={false}
                        />
                      </TableCell>
                      <TableCell padding="checkbox">
                        <FastField
                          as={Checkbox}
                          name={`deletedSourceIds`}
                          value={sourceId}
                          label="Remove"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={cancelHandler}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Edit
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditMediaDialog;
