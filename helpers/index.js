var crypto = require('crypto'),
    marked = require('marked');

module.exports = function(ejs) {
    /**
     * Статусы репозирориев
     * @type {{pub: string, int: string, priv: string}}
     */
    var status = {
        pub: 'public',
        int: 'internal',
        priv: 'public'
    };

    /**
     * MD5 хеш строки.
     * @param string
     * @returns {*}
     */
     ejs.filters.md5Hash = function(string) {
         return crypto.createHash('md5').update(string).digest('hex');
     };

    /**
     * Получение данных проекта по его ИД.
     * @param projects
     * @param id
     * @returns {string}
     */
    ejs.filters.getProjectInfo = function(projects, id) {
        var data = '';
        for(var index in projects) {
            var project = projects[index];
            if (project.id == id) {
                data = project;
            }
        }
        return data;
    };

    /**
     * Получение класса иконки по статусу проекта.
     * @param project
     * @param id
     * @returns {string}
     */
    ejs.filters.projectLevelIcon = function(project, id) {
        if (id) {
            project = this.getProjectInfo(project, id);
        }
        return (project.level == status.pub) ? "icon-globe" :
			   (project.level == status.int) ? "icon-tag"   :
               "icon-lock";
    };

    /**
     * Получение ссылки на страницу проекта.
     * @param projects
     * @param id
     * @returns {url}
     */
    ejs.filters.getProjectUrl = function(projects, id) {
        var project = this.getProjectInfo(projects, id);
        return project.url;
    };

    /**
     * Получение ссылки на такет проекта.
     * @param projects
     * @param id
     * @param issue
     * @returns {string}
     */
    ejs.filters.getIssuesUrl = function(projects, id, issue) {
        var projectUrl = this.getProjectUrl(projects, id);

        return projectUrl + '/issues/' + issue;
    };

    /**
     * Получение класса (цвета) тега.
     * @param label
     * @returns {string}
     */
    ejs.filters.labelColor = function(label) {
        var color = '';

        switch (label) {
            case "new":
                color = 'label-success';
                break;
            case "bug":
            case "critical":
            case "fatal":
                color = 'label-important';
                break;
            case "todo":
                color = 'label-warning';
                break;
            case "idea":
            case "plans":
                color = 'label-info';
                break;
            case "long":
                color = 'label-inverse';
                break;
        }

        return color;
    };

    /**
     * Преобразование markedown в html.
     * @param string
     * @returns {*}
     */
    ejs.filters.marked2Html = function(string) {
        return ejs.compile(marked(string));
    }
};
