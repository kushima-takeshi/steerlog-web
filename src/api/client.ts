export async function fetchWithAuth(
    path: string,
    token: string,
    options: RequestInit = {},
  ) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    })
  
    if (res.status === 401) {
      throw new Error('Unauthorized')
    }
  
    return res
  }