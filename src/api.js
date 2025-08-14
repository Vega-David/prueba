// Módulo para manejo de requests a la API externa
export const scriptURL = "https://script.google.com/macros/s/AKfycbw1AaXFlbDYyIYFlw1YBx9yj1gvya4PaTon3mqrP8_-6sPfKrqckZvb7pENPQS7av-f/exec";

export function sendDataToAPI(data) {
  const params = new URLSearchParams(data).toString();
  return fetch(`${scriptURL}?${params}`)
    .then(res => res.json());
}
