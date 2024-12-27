import asyncio
import logging
import sys
from os import getenv

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, MenuButtonWebApp, Message, WebAppInfo

TOKEN = getenv("BOT_TOKEN")

dp = Dispatcher()


@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    text = """<b>Эй, привет!</b> 👋
    
Угадай, что у нас есть? Крутая мини-игра от Магнит Маркета!
Пройди её и <b>забирай классные промокоды</b> на покупки в нашем приложении 🎁

Поиграем?
"""

    web_app = WebAppInfo(
        url="https://frontend.mmtgame.ru/"
    )

    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[InlineKeyboardButton(
            text="Поехали! 🚀", 
            web_app=web_app,
        )]]
    )
    
    await message.answer(
        text,
        reply_markup=keyboard
    )
    
    await message.bot.set_chat_menu_button(
        chat_id=message.chat.id,
        menu_button=MenuButtonWebApp(
            text="Играть",
            web_app=web_app,
        )
    )


async def main() -> None:
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
