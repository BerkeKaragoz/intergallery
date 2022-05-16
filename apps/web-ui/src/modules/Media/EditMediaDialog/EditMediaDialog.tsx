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
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LoadingButton from "@/components/LoadingButton";
import AppDropzone from "@/components/AppDropzone";

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

  const onDropHandler =
    (push: (obj: any) => void) =>
    (acceptedFiles: Array<File & { path?: string }>) => {
      console.log(acceptedFiles);

      for (const f of acceptedFiles) {
        push({
          ...addedSourceSchema.getDefaultFromShape(),
          url: f.path || f.name,
        });
      }
    };

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
                  spellCheck="false"
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "stretch",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Typography variant="h6" component="span" mt={1}>
                        Add Sources
                        <Button
                          variant="contained"
                          color="secondary"
                          aria-label="Add Source"
                          size="small"
                          onClick={() => {
                            push(addedSourceSchema.getDefaultFromShape());
                          }}
                          sx={{ ml: 2 }}
                        >
                          +
                        </Button>
                      </Typography>
                      <AppDropzone
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 0,
                          px: 2,
                          m: 0,
                          fontSize: "small",
                        }}
                        onDrop={onDropHandler(push)}
                      />
                    </Box>
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
                                spellCheck="false"
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
              <Typography variant="h6" component="span" mt={1}>
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
                          spellCheck="false"
                        />
                      </TableCell>
                      <TableCell padding="checkbox" align="center">
                        <FastField
                          as={Checkbox}
                          icon={<DeleteOutlinedIcon />}
                          checkedIcon={<DeleteIcon />}
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
              <LoadingButton
                variant="contained"
                type="submit"
                isLoading={isLoading}
              >
                Edit
              </LoadingButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditMediaDialog;
