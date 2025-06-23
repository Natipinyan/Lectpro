export const fetchUserData = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/students/register/me`, {
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
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/students/register/me`, {
        method: "put",
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