import { Box, Typography } from "@mui/material";

export default function ComponentBox({ children, ...props }) {
  let sx = {
    borderRadius: 2,
    bgcolor: 'white',
    display: 'flex',
    flexDirection: 'column',
  };

  if (props?.posx) {
    sx.position = 'absolute';
    sx.left = props?.posx;
    sx.top = props?.posy;
    sx.width = props?.width;
    sx.height = props?.height;
    sx.maxWidth = props?.width;
    sx.maxHeight = props?.height;
    sx.overflow = 'auto';
  } else {
    sx.alignItems = 'center';
    sx.display = 'flex';
    sx.flexDirection = 'column';
    sx.width = 'fit-content';
    sx.height = 'fit-content';
    sx.margin = 'auto';
  }

  return (
    <Box sx={sx} ref={props?.ref}>
      { (props?.title && props?.title != "") && 
        <Typography 
          sx={{ fontWeight: 'bold' }}
          variant="h6"
          align="center"
          color="black"
          padding="10px"
          paddingBottom="10px"
        >
          { props.title }
        </Typography>
      }
      { children }
    </Box>
  );
}