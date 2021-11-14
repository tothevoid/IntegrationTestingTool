export const TRANSLATION_RU = {
	button: {
		add: "Добавить",
		update: "Обновить",
		back: "Назад"
	},
	nav:{
		endpoints: "Конечные точки",
		auths: "Авторизации",
		logs: "Логи"
	},
	headers: {
		configure: "Настроить заголовки",
		list: "Список",
		name: "Название",
		value: "Значение"
	},
	endpoints: {
		search: "Поиск",
		active: "Активные",
		deleteWarningTitle: "Вы уверены?",
		deleteWarningText: "Вы действительно хотите удалить эту точку?",
		descriptionMain: "Возвращает код: {{code}}. Размер данных: {{dataSize}}",
		descriptionAdditional: "Затем вызывает [{{method}}] {{url}} ({{dataSize}})"
	},
	endpoint: {
		httpMethod: "HTTP метод",
		statusCode: "Код ответа",
		interaction: "Взаимодействие",
		interactionType: {
			sync: "Синхронное",
			async: "Асинхронное"
		},
		active: "Активно",
		configureHeaders: "Настроить заголовки ({{quantity}})",
		callback: "Обратный вызов",
		auth: "Авторизация",
		url: "Адрес",
		data: "Данные",
		attachByFile: "Загрузить данные из файла",
		action:{
			add: "Добавление точки",
			update: "Редактирование точки"
		},
		validation: {
			endpointUrl: "Адрес конечной точки задан некорректно",
			callbackUrl: "Адрес точки обратного вызова задан некорректно"
		},
		error: {
			save: "Ошибка при обработке запроса на сервере"
		}
	},
	auths: {
		deleteWarningTitle: "Вы уверены?",
		deleteWarningText: "Вы действительно хотите удалить эту авторизацию?",
		deletion:{
			success: "Авторизация успешно удалена",
			error: "Возникла ошибка при удалении авторизации"
		}
	},
	auth: {
		name: "Название",
		httpMethod: "HTTP метод",
		url: "Адрес",
		data: "Данные",
		requestHeaders: "Настроить заголовки ({{quantity}})",
		copiedHeaders: "Заголовки, копируемые в следующий запрос",
		addHeader: "Добавить заголовок",
		action:{
			add: "Добавление авторизации",
			update: "Редактирование авторизации"
		},
		validation: {
			url: "Адрес задан некорректно",
			name: "Название не может быть пустым",
			headers: "Хотя бы один параметр должен быть включён в следующий запрос"
		},
	},
	logs: {
		date: "Дата",
		newRequests: "Новых запросов: {{quantity}}",
		received: "Получено",
		returned: "Возвращено",
		code: "Код ответа",
		new: "Новый",
		dataSize: "Размер данных",
		error: "Ошибка при обработке запроса: {{message}}"
	}
}
