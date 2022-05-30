import Page from "@/components/Page"
import useAppModal from "@/hooks/useAppModal"
import useQuery from "@/hooks/useQuery"
import { createQuery } from "@/lib/utils"
import MediaSidebar, {
   SIDEBAR_BREAKPOINT,
   SIDEBAR_SMALL_BREAKPOINT,
} from "@/modules/Browse/BrowseSidebar"
import { MediaDTO } from "@/modules/Media"
import DeleteMediaDialog from "@/modules/Media/DeleteMediaDialog"
import { GetMediaInputDTO } from "@/modules/Media/utils"
import { useAppSelector } from "@/redux/hooks"
import { useGetMediaQuery } from "@/redux/slice/mediaApiSlice"
import DeleteIcon from "@mui/icons-material/Delete"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import {
   Button,
   CircularProgress,
   FormControl,
   IconButton,
   InputLabel,
   LinearProgress,
   MenuItem,
   Pagination,
   Select,
   useMediaQuery,
} from "@mui/material"
import { Box, useTheme } from "@mui/system"
import { Form, FormikProvider, useFormik } from "formik"
import React, { useRef, useState } from "react"
import { useNavigate } from "react-router"
import * as Yup from "yup"
import MediaGrid from "./BrowseGrid"

const DEFAULT_PERPAGE = 25
const DEFAULT_PAGE = 1

const mediaIdSchema = Yup.string().default("")

const deleteMediaSchema = Yup.object({
   ids: Yup.array(mediaIdSchema).default([]).min(1).required(),
})

const Browse = () => {
   //const dispatch = useAppDispatch();
   const query = useQuery()
   const navigate = useNavigate()
   const theme = useTheme()
   const userState = useAppSelector((state) => state.user)
   const matchesSidebar = useMediaQuery(theme.breakpoints.up(SIDEBAR_BREAKPOINT))
   const matchesSidebarSmall = useMediaQuery(
      theme.breakpoints.up(SIDEBAR_SMALL_BREAKPOINT)
   )

   const [mediaPage, setMediaPage] = useState<GetMediaInputDTO["page"]>(
      Number(query.get("page") ?? DEFAULT_PAGE)
   )
   const [mediaPerPage, setMediaPerPage] = useState<GetMediaInputDTO["perPage"]>(
      Number(query.get("perPage") ?? DEFAULT_PERPAGE)
   )
   const [isDeletionActive, setIsDeletionActive] = useState(false)

   const [highlightedMedia, setHighlightedMedia] = React.useState<MediaDTO | null>(
      null
   )

   const isFirstRender = useRef(true)

   const [DeleteMediaModal, openDeleteModal, closeDeleteMedia] = useAppModal(
      undefined,
      () => {
         setIsDeletionActive(false)
      }
   )

   const {
      data: mediaFetchData,
      isLoading: isMediaLoading,
      isFetching: isMediaFetching,
   } = useGetMediaQuery({
      page: mediaPage,
      perPage: mediaPerPage,
   })

   const delFormik = useFormik({
      initialValues: deleteMediaSchema.getDefault(),
      validationSchema: deleteMediaSchema,
      isInitialValid: false,
      onSubmit: (values) => {
         openDeleteModal()
      },
   })

   const highlightHandler = (item: MediaDTO) => {
      if (!matchesSidebar) return // if sidebar is shown
      setHighlightedMedia(item)
   }

   React.useEffect(() => {
      if (isFirstRender.current) {
         isFirstRender.current = false
         return
      }

      setMediaPage(+(query.get("page") ?? DEFAULT_PAGE))
      setMediaPerPage(+(query.get("perPage") ?? DEFAULT_PERPAGE))
   }, [query])

   React.useEffect(() => {
      if (!mediaFetchData) return

      setMediaPage(mediaFetchData.page)
      setMediaPerPage(mediaFetchData.perPage)
   }, [mediaFetchData])

   // TODO validate page
   React.useEffect(() => {
      navigate(
         {
            search: createQuery<keyof GetMediaInputDTO>(
               ["page", mediaPage, mediaPage !== DEFAULT_PAGE],
               ["perPage", mediaPerPage, mediaPerPage !== DEFAULT_PERPAGE]
            ),
         },
         { replace: true }
      )
   }, [mediaPage, mediaPerPage, navigate])

   return (
      <Page
         sidebar={
            <MediaSidebar
               open={matchesSidebar}
               userId={userState.data.id}
               highlightedMedia={highlightedMedia}
            >
               <Box
                  sx={{
                     position: "sticky",
                     top: "20px",
                     display: "flex",
                     justifyContent: "space-between",
                     alignItems: "center",
                  }}
               >
                  <div>
                     <IconButton
                        aria-label="delete media active"
                        color={isDeletionActive ? "primary" : "inherit"}
                        onClick={() => {
                           setIsDeletionActive((s) => !s)
                           delFormik.resetForm()
                        }}
                        sx={{
                           borderWidth: "1px",
                           borderStyle: "solid",
                           borderColor: ({ palette }) =>
                              isDeletionActive
                                 ? palette.primary.dark
                                 : palette.action.disabled,
                        }}
                     >
                        {isDeletionActive ? <DeleteIcon /> : <DeleteOutlineIcon />}
                     </IconButton>
                     {isDeletionActive && (
                        <Button
                           variant="contained"
                           type="submit"
                           onClick={(e) => {
                              e.preventDefault()
                              delFormik.submitForm()
                           }}
                           disabled={!delFormik.isValid}
                           sx={{ ml: 2 }}
                           size={matchesSidebarSmall ? "medium" : "small"}
                        >
                           Delete
                        </Button>
                     )}
                  </div>
                  <div>
                     <InputLabel
                        id="sidebar-per-page-label"
                        sx={{ fontSize: "small" }}
                     >
                        Per Page
                     </InputLabel>
                     <FormControl>
                        <Select
                           labelId="sidebar-per-page-label"
                           id="sidebar-per-page"
                           variant="standard"
                           value={mediaPerPage}
                           label="Per Page"
                           onChange={({ target }) => {
                              if (target.value && target.value !== mediaPerPage)
                                 setMediaPerPage(target.value as number) // value is controlled
                           }}
                        >
                           <MenuItem value={5}>5</MenuItem>
                           <MenuItem value={10}>10</MenuItem>
                           <MenuItem value={25}>25</MenuItem>
                           <MenuItem value={50}>50</MenuItem>
                        </Select>
                     </FormControl>
                  </div>
               </Box>
            </MediaSidebar>
         }
      >
         {isMediaLoading && isMediaFetching ? (
            <Box sx={{ textAlign: "center", mb: 2 }}>
               <CircularProgress color="secondary" />
            </Box>
         ) : (
            mediaFetchData && (
               <FormikProvider value={delFormik}>
                  <Form>
                     <MediaGrid
                        mediaList={mediaFetchData.data}
                        highlightHandler={highlightHandler}
                        showDeleteCheckboxes={isDeletionActive}
                     />
                  </Form>
               </FormikProvider>
            )
         )}

         <LinearProgress
            variant="determinate"
            sx={{ height: "1px", width: "128px", mx: "auto", my: 2 }}
            value={
               mediaFetchData && mediaPage
                  ? (mediaPage / mediaFetchData.totalPages) * 100
                  : 0
            }
         />

         <Pagination
            shape="rounded"
            count={mediaFetchData?.totalPages}
            page={mediaPage}
            sx={{ display: "flex", justifyContent: "center" }}
            onChange={(_, p) => {
               setMediaPage(p)
            }}
         />

         <DeleteMediaModal>
            <DeleteMediaDialog
               ids={delFormik.values.ids}
               cancelHandler={closeDeleteMedia}
            />
         </DeleteMediaModal>
      </Page>
   )
}

export default Browse
