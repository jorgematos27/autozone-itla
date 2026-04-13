const BASE_URL = "https://taller-itla.ia3x.com/api";


const getToken = () => localStorage.getItem("token");

// Petición GET autenticada
export const get = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
};


export const post = async (endpoint, data, requiresAuth = true) => {
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  if (requiresAuth) headers["Authorization"] = `Bearer ${getToken()}`;

  const body = new URLSearchParams({ datax: JSON.stringify(data) });

  console.log('POST', endpoint, JSON.stringify(data)); // <-- agrega esta linea

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body
  });
  return res.json();
};


export const postForm = async (endpoint, formData) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
};