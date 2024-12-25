import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { hapticFeedback } from '@telegram-apps/sdk-react';

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Tabbar>
      <Tabbar.Item
        key={'/game'}
        text="Играть"
        selected={location.pathname === '/game'}
        onClick={() => {
          if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('light');
          navigate('/game')}
        }
      >
        <VideogameAssetIcon />
      </Tabbar.Item>
      <Tabbar.Item
        key={'/prizes'}
        text="Призы"
        selected={location.pathname === '/prizes'}
        onClick={() => {
          if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('light');
          navigate('/prizes')}
        }
      >
        <EmojiEventsIcon />
      </Tabbar.Item>
    </Tabbar>
  );
};

export default BottomNavBar;
