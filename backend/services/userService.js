export function getUserFromDatabase(userId) {
    return {
        _id: userId,
        name: "John Doe",
        email: "john@example.com",
        history: []
    };
}