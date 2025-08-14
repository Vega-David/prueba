// Módulo para manejo de almacenamiento local
export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function appendToArray(key, value) {
  const arr = getData(key) || [];
  arr.push(value);
  saveData(key, arr);
}
