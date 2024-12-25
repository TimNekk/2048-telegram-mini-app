import React from 'react';
import { Page } from '@/components/Page';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Button, Cell, List, Section, Timeline } from '@telegram-apps/telegram-ui';
import { TimelineItem } from '@telegram-apps/telegram-ui/dist/components/Blocks/Timeline/components/TimelineItem/TimelineItem';
import { SectionHeader } from '@telegram-apps/telegram-ui/dist/components/Blocks/Section/components/SectionHeader/SectionHeader';
import { Stack } from '@mui/material';
import { hapticFeedback } from '@telegram-apps/sdk-react';

const PrizesPage: React.FC = () => {


  return (
    <Page>
      <List>
        <Button onClick={() => {if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('light');}}>impect light</Button>
        <Button onClick={() => {if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('medium');}}>impect medium</Button>
        <Button onClick={() => {if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('heavy');}}>impect heavy</Button>
        <Button onClick={() => {if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('rigid');}}>impect rigid</Button>
        <Button onClick={() => {if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred('soft');}}>impect soft</Button>

        <Button onClick={() => {if (hapticFeedback.notificationOccurred.isAvailable()) hapticFeedback.notificationOccurred('error');}}>notification error</Button>
        <Button onClick={() => {if (hapticFeedback.notificationOccurred.isAvailable()) hapticFeedback.notificationOccurred('success');}}>notification success</Button>
        <Button onClick={() => {if (hapticFeedback.notificationOccurred.isAvailable()) hapticFeedback.notificationOccurred('warning');}}>notification warning</Button>

        <Button onClick={() => {if (hapticFeedback.selectionChanged.isAvailable()) hapticFeedback.selectionChanged();}}>selection</Button>

        <SectionHeader large>
          Призы
        </SectionHeader>

        <Section
          header="Статистика"
        >
          <Stack
            direction="row"
            spacing={3}
          >
            <Cell
              subtitle="Рекорд"
              type="text"
              interactiveAnimation="opacity"
              before={<EmojiEventsIcon />}
            >
              6 238
            </Cell>
            <Cell
              subtitle="Всего очков"
              type="text"
              interactiveAnimation="opacity"
              before={<ArchiveIcon />}
            >
              148 923
            </Cell>
          </Stack>
        </Section>

        <Section
          header="За рекорд"
          footer="Получите призы за лучший результат в одной игре. Чем выше ваш рекорд, тем ценнее награда!"
        >
          <Timeline>
            <TimelineItem header="Промокод на 50 ₽ от 1000 ₽" mode="active">
              {/* <Text>1 000 очков</Text> */}
              <Button
                before={<ContentCopyIcon />}
                mode="bezeled"
                stretched
              >
                dj2kDjk2Js230
              </Button>
              {/* <Button
                  mode="filled"
                  stretched
                  loading={true}
                >
                  Получить
                </Button> */}
            </TimelineItem>
            <TimelineItem header="Промокод на 100 ₽ от 1000 ₽" mode="pre-active">
              {/* <Text>5 000 очков</Text> */}
              {/* <Button
                before={<ContentCopyIcon />}
                mode="bezeled"
                stretched
              >
                dj2kDjk2Js230
              </Button> */}
              <Button
                mode="filled"
                stretched
                loading={false}
              >
                Получить
              </Button>
            </TimelineItem>
            <TimelineItem header="Промокод на 150 ₽ от 1000 ₽">
              10 000 очков
            </TimelineItem>
            <TimelineItem header="Промокод на 200 ₽ от 1000 ₽">
              20 000 очков
            </TimelineItem>
            <TimelineItem header="Промокод на 250 ₽ от 1000 ₽">
              50 000 очков
            </TimelineItem>
            <TimelineItem header="Промокод на 300 ₽ от 1000 ₽">
              100 000 очков
            </TimelineItem>
            <TimelineItem header="Промокод на 400 ₽ от 1000 ₽">
              500 000 очков
            </TimelineItem>
          </Timeline>
        </Section>

        <Section
          header="За все игры"
          footer="Играйте больше и накапливайте очки! Эти призы вы получите за суммарное количество очков во всех играх."
        >
          <Timeline
            active={2}
          >
            <TimelineItem header="Arrived">
              Yesterday
            </TimelineItem>
            <TimelineItem header="Departed">
              Today
            </TimelineItem>
            <TimelineItem header="In transit">
              Tomorrow
            </TimelineItem>
            <TimelineItem header="Processed to delivery center">
              Next week
            </TimelineItem>
            <TimelineItem header="Shipped">
              Someday
            </TimelineItem>
          </Timeline>
        </Section>

      </List>
    </Page>
  );
};

export default PrizesPage;
