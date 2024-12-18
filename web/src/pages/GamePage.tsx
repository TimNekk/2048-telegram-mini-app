import React from 'react';
import { Box, Typography } from '@mui/material';

const GamePage: React.FC = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Игра
      </Typography>
      {/* Add your game content here */}
    </Box>
  );
};

export default GamePage;
