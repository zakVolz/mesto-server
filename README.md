# 'Mesto-server' Версия: 1.0.0

Чтобы развернуть проект у себя на ПК необходимо установить [Git](https://git-scm.com/), [Node.js с NPM](https://nodejs.org/en/), система управления базами данных [Mongo](https://www.mongodb.com/download-center/community?jmp=docs) и программа для отправки запросов [Postman](https://www.postman.com/downloads/)

В терминале Git Bush нужно выполнить следующие команды:
```
git clone https://github.com/zakVolz/sprint15.git # клонирует данный репозиторий
cd sprint15 # переходим в папку репозитория
npm install # установит все зависимости из package.json
```

Запросы с сервера
```
На запрос GET https://api.mesto-prod.tk/users сервер вернёт JSON-объект со всеми пользователями.

PATCH https://api.mesto-prod.tk/users/me обновляет данные профиля name и about.

PATCH https://api.mesto-prod.tk/users/me/avatar обновляет avatar профиля.

GET https://api.mesto-prod.tk/users/id вернёт запрошенного по ID пользователя.

POST https://api.mesto-prod.tk/signup создаст пользователя по введённым данным name, about, avatar.
В поле avatar должна быть ссылка,
в поле email должен быть корректный адрес, иначе сервер вернёт ошибку.

POST https://api.mesto-prod.tk/signin выполняет авторизацию пользователя, выдаёт токен на 7 дней.

GET https://api.mesto-prod.tk/cards возвращает JSON-объект со всеми карточками.

POST https://api.mesto-prod.tk/cards создаст карточку по введённым данным name, link.
В поле link должна быть ссылка, иначе сервер вернёт ошибку.

DELETE https://api.mesto-prod.tk/cards/id удаляет найденную по ID карточку, если она создана вами.

PUT https://api.mesto-prod.tk/cards/id/likes добавляет в массив likes объекта карточки информацию
о профиле создателя запроса.

DELETE https://api.mesto-prod.tk/cards/id/likes удаляет из массива likes объекта карточки информацию
о профиле создателя запроса.
```

```
Сервер имеет централизованную обработку ошибок с соответствующими кодами,
возвращает их в формате JSON. Ошибки возникают если пытаться перейти по несуществующему адресу,
создать карточку/пользователя с невалидными данными, допустить ошибку при вводе ID,
попытаться удалить чужую карточку и т.д.
```
