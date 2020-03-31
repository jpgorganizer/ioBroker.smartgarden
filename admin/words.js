/*global systemDictionary:true */
"use strict";

systemDictionary = {
  "smartgarden adapter settings": {
    "en": "Adapter settings for smartgarden",
    "de": "Adaptereinstellungen für smartgarden",
    "ru": "Настройки адаптера для smartgarden",
    "pt": "Configurações do adaptador para smartgarden",
    "nl": "Adapterinstellingen voor smartgarden",
    "fr": "Paramètres d'adaptateur pour smartgarden",
    "it": "Impostazioni dell'adattatore per smartgarden",
    "es": "Ajustes del adaptador para smartgarden",
    "pl": "Ustawienia adaptera dla smartgarden",
    "zh-cn": "smartgarden的适配器设置"
  },
  "gardena_password": {
    "en": "Password",
    "de": "Passwort",
    "ru": "пароль",
    "pt": "Senha",
    "nl": "Wachtwoord",
    "fr": "Mot de passe",
    "it": "Parola d'ordine",
    "es": "Contraseña",
    "pl": "Hasło"
  },
  "gardena_username": {
    "en": "Username",
    "de": "Nutzername",
    "ru": "имя пользователя",
    "pt": "Nome de usuário",
    "nl": "Gebruikersnaam",
    "fr": "Nom d'utilisateur",
    "it": "Nome utente",
    "es": "Nombre de usuario",
    "pl": "Nazwa Użytkownika"
  },
  "gardena_api_key": {
    "en": "API key",
    "de": "API key",
    "ru": "Ключ API",
    "pt": "Chave API",
    "nl": "API sleutel",
    "fr": "Clé API",
    "it": "Chiave API",
    "es": "Clave API",
    "pl": "Klucz API",
    "zh-cn": "API密钥"
  },
  "gardena_authentication_host": {
    "en": "Authentication host URL (https://api.authentication.husqvarnagroup.dev)",
    "de": "Authentifizierungshost-URL (https://api.authentication.husqvarnagroup.dev)",
    "ru": "URL хоста аутентификации (https://api.authentication.husqvarnagroup.dev)",
    "pt": "URL do host de autenticação (https://api.authentication.husqvarnagroup.dev)",
    "nl": "URL van authenticatiehost (https://api.authentication.husqvarnagroup.dev)",
    "fr": "URL de l'hôte d'authentification (https://api.authentication.husqvarnagroup.dev)",
    "it": "URL host di autenticazione (https://api.authentication.husqvarnagroup.dev)",
    "es": "URL de host de autenticación (https://api.authentication.husqvarnagroup.dev)",
    "pl": "Adres URL hosta uwierzytelniania (https://api.authentication.husqvarnagroup.dev)",
    "zh-cn": "认证主机URL (https://api.authentication.husqvarnagroup.dev)"
  },
  "gardena_ping_frequence": {
    "en": "Frequence for sending Ping's to Gardena Webservice (in seconds)",
    "de": "Häufigkeit für das Senden von Pings an Gardena Webservice (in Sekunden)",
    "ru": "Частота отправки Ping's в Gardena Webservice (в секундах)",
    "pt": "Frequência para o envio de ping para o Gardena Webservice (em segundos)",
    "nl": "Frequentie voor het verzenden van Ping's naar Gardena Webservice (in seconden)",
    "fr": "Fréquence d'envoi des Ping à Gardena Webservice (en secondes)",
    "it": "Frequenza per l'invio di ping a Gardena Webservice (in secondi)",
    "es": "Frecuencia para enviar Ping's al servicio web de Gardena (en segundos)",
    "pl": "Częstotliwość wysyłania pingów do Gardena Webservice (w sekundach)",
    "zh-cn": "将Ping发送到Gardena Webservice的频率（以秒为单位）"
  },
  "gardena_authtoken_factor": {
    "en": "Factor for validity of authentication token",
    "de": "Faktor für die Gültigkeit des Authentifizierungstokens",
    "ru": "Коэффициент достоверности токена аутентификации",
    "pt": "Fator de validade do token de autenticação",
    "nl": "Factor voor geldigheid van authenticatietoken",
    "fr": "Facteur de validité du jeton d'authentification",
    "it": "Fattore di validità del token di autenticazione",
    "es": "Factor para la validez del token de autenticación",
    "pl": "Czynnik ważności tokena uwierzytelniającego",
    "zh-cn": "认证令牌有效性的因素"
  },
  "useTestVariable": {
    "en": "testVariable: use test variable for debug",
    "de": "testVariable: testVariable für Debug Zwecke",
    "ru": "testVariable: используйте тестовую переменную для отладки",
    "pt": "testVariable: use variável de teste para depuração",
    "nl": "testVariable: gebruik testvariabele voor foutopsporing",
    "fr": "testVariable: utiliser la variable de test pour le débogage",
    "it": "testVariable: usa la variabile test per il debug",
    "es": "testVariable: usar variable de prueba para depurar",
    "pl": "testVariable: użyj zmiennej testowej do debugowania",
    "zh-cn": "使用测试变量进行调试"
  },
  "preDefineStates": {
    "en": "preDefineStates: pre-define all states of Gardena API regardless they are currently transmitted",
    "de": "preDefineStates: Definieren aller Zustände der Gardena-API vorab, unabhängig davon, ob sie aktuell übertragen werden",
    "ru": "preDefineStates: предварительно определить все состояния API Gardena независимо от того, передаются ли они в данный момент",
    "pt": "preDefineStates: pré-defina todos os estados da Gardena API, independentemente de serem transmitidos atualmente",
    "nl": "preDefineStates: definieer vooraf alle staten van Gardena API, ongeacht of ze momenteel worden verzonden",
    "fr": "preDefineStates: prédéfinir tous les états de l'API Gardena, quels qu'ils soient actuellement transmis",
    "it": "preDefineStates: pre-definire tutti gli stati dell'API Gardena indipendentemente dal fatto che siano attualmente trasmessi",
    "es": "preDefineStates: predefinir todos los estados de la API de Gardena independientemente de que se transmitan actualmente",
    "pl": "preDefineStates: wstępnie zdefiniuj wszystkie stany interfejsu API Gardena, niezależnie od tego, które są aktualnie przesyłane",
    "zh-cn": "preDefineStates: 预先定义Gardena API的所有状态，无论当前是否传输它们"
  },
  "logLevel": {
    "en": "Loglevel: 0 = no log, 1 = some logs, 2 = some more logs, 3 = all logs",
    "de": "Loglevel: 0 = no log, 1 = some logs, 2 = some more logs, 3 = all logs",
    "ru": "Уровень журнала: 0 = нет журнала, 1 = несколько журналов, 2 = еще несколько журналов, 3 = все журналы",
    "pt": "Nível de log: 0 = nenhum log, 1 = alguns logs, 2 = mais alguns logs, 3 = todos os logs",
    "nl": "Logniveau: 0 = geen log, 1 = enkele logs, 2 = nog enkele logs, 3 = alle logs",
    "fr": "Loglevel: 0 = aucun journal, 1 = certains journaux, 2 = quelques journaux supplémentaires, 3 = tous les journaux",
    "it": "Loglevel: 0 = nessun registro, 1 = alcuni registri, 2 = altri registri, 3 = tutti i registri",
    "es": "Loglevel: 0 = sin registro, 1 = algunos registros, 2 = algunos registros más, 3 = todos los registros",
    "pl": "Loglevel: 0 = brak dziennika, 1 = niektóre dzienniki, 2 = więcej dzienników, 3 = wszystkie dzienniki",
    "zh-cn": "日志级别：0 =无日志，1 =一些日志，2 =更多日志，3 =所有日志"
  },
  "smart_host": {
    "en": "Webservice Basis-URL (https://api.smart.gardena.dev)",
    "de": "Webservice Basis-URL (https://api.smart.gardena.dev)",
    "ru": "URL-адрес веб-сервиса (https://api.smart.gardena.dev)",
    "pt": "Base de Webservice URL (https://api.smart.gardena.dev)",
    "nl": "Webservice Basis-URL (https://api.smart.gardena.dev)",
    "fr": "URL de base du service Web (https://api.smart.gardena.dev)",
    "it": "URL di base del servizio Web (https://api.smart.gardena.dev)",
    "es": "URL de base de servicio web (https://api.smart.gardena.dev)",
    "pl": "Webservice Basis-URL (https://api.smart.gardena.dev)",
    "zh-cn": "Webservice Basis-URL (https://api.smart.gardena.dev)"
  },
  "main settings": {
    "en": "main settings",
    "de": "Haupteinstellungen",
    "ru": "Основные параметры",
    "pt": "configurações principais",
    "nl": "belangrijkste instellingen",
    "fr": "Réglages principaux",
    "it": "impostazioni principali",
    "es": "ajustes principales",
    "pl": "Ustawienia główne"
  },
  "miscellaneous": {
    "en": "Miscellaneous",
    "de": "Verschiedenes",
    "ru": "Разнообразный",
    "pt": "Diversos",
    "nl": "Diversen",
    "fr": "Divers",
    "it": "miscellaneo",
    "es": "Diverso",
    "pl": "Różne",
    "zh-cn": "杂"
  }
};