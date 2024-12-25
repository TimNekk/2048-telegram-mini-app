import { GameContext } from "@/components/Game/context/game-context";
import { Section, Title, Cell } from "@telegram-apps/telegram-ui";
import { useContext } from "react";

export default function Score() {
  const { score } = useContext(GameContext);

  return (
    <Section
      header="Очки"
    >
      <Cell
        interactiveAnimation="opacity"
      >
        <Title weight="2">
          {score}
        </Title>
      </Cell>
    </Section>
  );
}
