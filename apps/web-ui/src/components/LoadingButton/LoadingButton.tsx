import { Button, ButtonProps, CircularProgress } from "@mui/material"

type Props = ButtonProps & {
   isLoading?: boolean
}

const LoadingButton: React.FC<Props> = (props) => {
   const { isLoading = false, children, ...rest } = props

   return (
      <Button {...rest}>
         {isLoading ? (
            <>
               <CircularProgress
                  color="inherit"
                  size={16}
                  sx={{ position: "absolute" }}
               />
               <div style={{ opacity: 0 }}>{children}</div>
            </>
         ) : (
            children
         )}
      </Button>
   )
}

export default LoadingButton
export type { Props as LoadingButtonProps }
