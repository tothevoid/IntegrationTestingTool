export const TRANSLATION_RU = {
	button: {
		add: "Добавить",
		update: "Обновить"
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
			add: "Добавить точку",
			update: "Обновить точку"
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
	}
}
