import React from 'react';
import { Box, Typography } from '@mui/material';
import { Page } from '@/components/Page';

const PrizesPage: React.FC = () => {
  return (
    <Page>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Призы
        </Typography>
        {/* Add your prizes content here */}
      </Box>
    </Page>
  );
};

export default PrizesPage;
