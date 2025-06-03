import axios from 'axios';

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
	console.log(response.data);
} catch (error) {
	console.error(error);
}