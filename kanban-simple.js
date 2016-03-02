var nano = require('nano')('http://localhost:5984');
var kanbandb = nano.db.use('kanban');

