
export function mockTaskManager() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: "Learn Javascript" },
                { id: 2, name: "Practice DOM Manipulation"} ,
                { id: 3, name: "Build a mini project" },
                { id: 4, name: "Revise CSS Flexbox" },
            ]);
        }, 2000);
    });
}