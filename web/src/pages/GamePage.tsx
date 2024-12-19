import React from 'react';
import { Box, Typography } from '@mui/material';
import Score from '@/components/Game/components/score';
import styles from "@/components/Game/styles/index.module.css";
import Board from '@/components/Game/components/board';
import "@/components/Game/styles/globals.css";

const GamePage: React.FC = () => {
  return (
    <div className={styles.twenty48}>
      <Typography variant="h5" component="h1" gutterBottom>
        2048
      </Typography>
      <Score />
      <Board />
    </div>
  );
};

export default GamePage;
