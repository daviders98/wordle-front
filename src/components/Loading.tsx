import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={'#1a1a1b'}
      color={'white'}
    >
      <CircularProgress sx={{ color: 'white' }}/>
    </Box>
  );
}

export default Loading;
