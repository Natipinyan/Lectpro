export const fetchUserData = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/students/register/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data;
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

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data;
};

export const fetchInstructorData = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/instructor/register/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data;
};

export const updateInstructorData = async (formData) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/instructor/register/me`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data.data;
};