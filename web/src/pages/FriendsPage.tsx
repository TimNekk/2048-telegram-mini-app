import { Page } from "@/components/Page";
import { List, Section } from "@telegram-apps/telegram-ui";

import { InviteUrlCell } from "@/components/InviteUrlCell";
import { FriendsSection } from "@/components/FriendsSection";

export const FriendsPage: React.FC = () => {
    return (
        <Page back={true}>
            <List>
                <Section footer="Поделись ссылкой с другом, чтобы добавить его в друзья!">
                    <InviteUrlCell />
                </Section>

                <FriendsSection />
            </List>
        </Page>
    );
};
