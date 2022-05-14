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

const sourceSchema = Yup.object({
  url: Yup.string().default(""),
  isLocal: Yup.boolean().default(true).required(),
});

const mediaSchema = Yup.object({
  name: Yup.string().default("").max(100),
  sources: Yup.array(sourceSchema).default([]).required(),
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

  console.log("media", media);

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
          console.log("submit", value);
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
              <FieldArray name="sources">
                {({ remove, push }) => (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="h6"
                        sx={{ display: "inline-block", marginRight: 2 }}
                      >
                        Add Sources
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        aria-label="Add Source"
                        size="small"
                        onClick={() => {
                          push(sourceSchema.getDefaultFromShape());
                        }}
                      >
                        +
                      </Button>
                    </Box>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">#</TableCell>
                          <TableCell>URL</TableCell>
                          <TableCell padding="checkbox">Local</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {values.sources.map((s, i) => (
                          <TableRow key={`${media.id}-source-${i}`}>
                            <TableCell padding="checkbox">{i + 1}</TableCell>
                            <TableCell>
                              <FastField
                                as={TextField}
                                name={`sources.${i}.url`}
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
                                name={`sources.${i}.isLocal`}
                                label="Is Local"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </FieldArray>
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
