import React from 'react';
import Score from '@/components/Game/components/score';
import Board from '@/components/Game/components/board';
import "@/components/Game/styles/globals.css";
import { List } from '@telegram-apps/telegram-ui';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';
import { Page } from '@/components/Page';

const GamePage: React.FC = () => {
  return (
    <Page back={false}>
      <List>
        <SectionHeader large>
          2048 от Магнит Маркета
        </SectionHeader>
        <Score />

        <div
          style={{
            marginTop: '1em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Board />
        </div>
      </List>
    </Page>
  );
};

export default GamePage;
