interface NicknameDictionary {
    adjectives: string[];
    nouns: string[];
}

const nicknameDictionary: NicknameDictionary = {
    adjectives: [
        "Танцующий",
        "Сияющий",
        "Могучий",
        "Летающий",
        "Скользящий",
        "Смеющийся",
        "Грустный",
        "Веселый",
        "Мудрый",
        "Хитрый",
        "Быстрый",
        "Медленный",
        "Сонный",
        "Бодрый",
        "Сильный",
        "Тихий",
        "Громкий",
        "Яркий",
        "Тусклый",
        "Храбрый",
        "Забавный",
        "Умный",
        "Добрый",
        "Злой",
        "Величественный",
        "Сказочный",
        "Стремительный",
        "Мечтательный",
        "Огненный",
        "Холодный",
        "Радостный",
        "Печальный",
        "Необычный",
        "Волшебный",
        "Грозный",
        "Колючий",
        "Теплый",
    ],
    nouns: [
        "Кот",
        "Дракон",
        "Енот",
        "Медведь",
        "Лев",
        "Тигр",
        "Слон",
        "Волк",
        "Заяц",
        "Орёл",
        "Сокол",
        "Пингвин",
        "Краб",
        "Кит",
        "Дельфин",
        "Попугай",
        "Ёжик",
        "Филин",
        "Суслик",
        "Барсук",
        "Павлин",
        "Жираф",
        "Крокодил",
        "Верблюд",
        "Муравей",
    ],
};

function generateNickname(): string {
    const randomAdjective =
        nicknameDictionary.adjectives[
            Math.floor(Math.random() * nicknameDictionary.adjectives.length)
        ];
    const randomNoun =
        nicknameDictionary.nouns[Math.floor(Math.random() * nicknameDictionary.nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
}

export default generateNickname;
