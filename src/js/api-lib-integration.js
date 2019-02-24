window.apiConfig = {
    getAuthHeaders() {
        const userId = window.localStorage.getItem('userId');
        const authToken = window.localStorage.getItem('authToken');
        if (typeof userId === 'string' && userId.length === 24 &&
                typeof authToken === 'string' && authToken.length > 5) {
            return {
                'Authorization': 'User ' + authToken,
            };
        }

        return {};
    },

    getUserId() {
        const userId = window.localStorage.getItem('userId');
        if (typeof userId === 'string' && userId.length === 24) {
            return userId;
        }

        return null;
    },

    setAuthDetails(user, authToken) {
        window.localStorage.setItem('userId', user.id);
        window.localStorage.setItem('authToken', authToken);
        window.apiConfig.updateCachedUser(user);
    },

    updateCachedUser(user) {
        window.localStorage.setItem('cachedUser', JSON.stringify(user));
    },

    clearAuthDetails() {
        window.localStorage.removeItem('userId');
        window.localStorage.removeItem('authToken');
        window.localStorage.removeItem('cachedUser');
    },

    /**
     * Returns the user as it was last cached. If the user is read from here, the user should
     * be updated immediately afterwards.
     */
    getCachedUser() {
        try {
            const cached = window.localStorage.getItem('cachedUser');
            if (typeof cached === 'string' && cached.length) {
                return JSON.parse(cached);
            }
        } catch (e) {
        }

        return null;
    },

    apiBaseUrl: window.config.apiBaseUrl,

    loggingSource: 'TEAMS_WEB',

    /**
     * This method is not required to be in the object.
     *
     * @return {null|String}
     */
    getAuthToken() {
        const token = window.localStorage.getItem('authToken');
        if (token) {
            return token;
        } else {
            return null;
        }
    },
};
