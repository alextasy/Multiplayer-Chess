export function fetchRequest(url, body, headers = {}, type = 'POST') {
    return fetch(process.env.REACT_APP_BASE_URL + url, {
        method: type,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body)
    });
}

export function fetchGET(url, queryParams = {}, headers = {}) {
    const query = new URLSearchParams(queryParams).toString()
    return fetch(`${process.env.REACT_APP_BASE_URL}${url}${query ? '?' : ''}${query}`, {
        method: 'GET',
        headers: {
            ...headers,
        }
    });
}
