export const fetchUserData = async () => {
    const response = await fetch("http://localhost:5000/students/register/getUser", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

export const updateUserData = async (formData) => {
    const response = await fetch("http://localhost:5000/students/register/Update", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};