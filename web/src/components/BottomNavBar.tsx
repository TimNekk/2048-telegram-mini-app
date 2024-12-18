import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { miniApp } from '@telegram-apps/sdk-react';

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        value={location.pathname}
        onChange={(_, newValue) => {
          navigate(newValue);
        }}
        sx={{ 
          borderTop: `1px solid var(--tg-theme-hint-color)`,
          backgroundColor: 'var(--tg-theme-bg-color)',
          '& .MuiBottomNavigationAction-root': {
            color: 'var(--tg-theme-hint-color)',
            '&.Mui-selected': {
              color: 'var(--tg-theme-button-color)',
            },
          },
        }}
      >
        <BottomNavigationAction
          label="Игра"
          value="/game"
          icon={<VideogameAssetIcon />}
        />
        <BottomNavigationAction
          label="Призы"
          value="/prizes"
          icon={<EmojiEventsIcon />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNavBar;
