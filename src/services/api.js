const BASE_URL = "https://taller-itla.ia3x.com/api";

// Guarda y obtiene el token
const getToken = () => localStorage.getItem("token");

// Petición GET autenticada
export const get = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};

// Petición POST con datax (form-encoded)
export const post = async (endpoint, data, requiresAuth = true) => {
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  if (requiresAuth) headers["Authorization"] = `Bearer ${getToken()}`;

  const body = new URLSearchParams({ datax: JSON.stringify(data) });

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body
  });
  return res.json();
};

// Petición POST con multipart (fotos)
export const postForm = async (endpoint, formData) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
};