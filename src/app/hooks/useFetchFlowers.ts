import axios from 'axios';

const useFetchFlowers = async (locale: string) => {
  const options = {
    method: 'GET',
    url: 'https://red-flower-business-data.p.rapidapi.com/business-details',
    params: {
      business_id: 'TRBP1G1l8vZkjgfqdx96Cw',
      yelp_domain: 'yelp.com'
    },
    headers: {
      'x-rapidapi-key': '24faa52b25msh4bee7c120e35a64p12ee61jsn08d2bf4c6923',
      'x-rapidapi-host': 'red-flower-business-data.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default useFetchFlowers;