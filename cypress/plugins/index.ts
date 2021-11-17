// Plugins enable you to tap into, modify, or extend the internal behavior of Cypress
// For more info, visit https://on.cypress.io/plugins-api
module.exports = (on, config) => {
    // Define "log" and "table" tasks, used for logging accessibility errors during CI
    // Borrowed from https://github.com/component-driven/cypress-axe#in-cypress-plugins-file
    on('task', {
        log(message: string) {
            console.log(message);
            return null;
        },
        table(message: string) {
            console.table(message);
            return null;
        }
    });
};
