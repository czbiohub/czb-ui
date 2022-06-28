import MaterialInputBase, { InputBaseProps } from "@mui/material/InputBase";
import { styled } from "@mui/system";

// https://mui.com/material-ui/customization/how-to-customize/#dynamic-overrides
interface StyledInputBaseProps extends InputBaseProps {
	error?: boolean
}

export const Input = styled(MaterialInputBase, {
	shouldForwardProp: (prop) => prop !== 
})<StyledInputBaseProps>(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.line.main,
  padding: "10px",
})) as typeof MaterialInputBase;
