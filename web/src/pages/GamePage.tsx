import React from 'react';
import Score from '@/components/Game/components/score';
import Board from '@/components/Game/components/board';
import "@/components/Game/styles/globals.css";
import { List } from '@telegram-apps/telegram-ui';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';

const GamePage: React.FC = () => {
  return (
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
    // </div>

    // <List>
    //   <Section header="Header for the section" footer="Footer for the section">
    //     <Cell key={1}>
    //       123
    //     </Cell>
    //     <Cell key={1}>
    //       321
    //     </Cell>
    //   </Section>
    //   <Section header="Header for the section" footer="Footer for the section">
    //     <Cell key={1}>
    //       123
    //     </Cell>
    //     <Cell key={1}>
    //       321
    //     </Cell>
    //   </Section>
    // </List>
  );
};

export default GamePage;
