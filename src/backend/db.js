// Our API for demos only
export var fakeDataBase = {
    get: function () {
        var res = { data: 'This fake data came from the db on the server.' };
        return Promise.resolve(res);
    }
};
//# sourceMappingURL=db.js.map