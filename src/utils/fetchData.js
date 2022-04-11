const fetchData = async (query) => {
  const endpoint = 'https://henrykc-ecommerce-mini.herokuapp.com/';
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
  };

  const result = await fetch(endpoint, {
    method,
    headers,
    body: JSON.stringify({
      query,
    }),
  });
  const data = await result.json();
  return data;
};

export default fetchData;
