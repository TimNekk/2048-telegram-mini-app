import type { ComponentType, JSX } from 'react';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GamePage from '@/pages/GamePage';
import PrizesPage from '@/pages/PrizesPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { 
    path: '/game', 
    Component: GamePage, 
    title: 'Игра',
    icon: <VideogameAssetIcon />
  },
  { 
    path: '/prizes', 
    Component: PrizesPage, 
    title: 'Призы',
    icon: <EmojiEventsIcon />
  }
];
