export const requestTeas = () => {
  return fetch('api/teas');
}

export const requestTea = (teaId) => {
  return fetch(`/api/teas/${teaId}`)
};

export const asyncAwaitTeas = async () => {
  const res = await fetch('api/teas')
  if (res.ok) {
    const data = await res.json();
    return data
  } else {
    //error handling
  }
}

export const postTea = (tea) => {
  return fetch('api/teas', {
    method: 'POST',
    body: JSON.stringify(tea),
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
}