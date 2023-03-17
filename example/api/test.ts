import axios from 'axios';

export const testApi = async (name: string): Promise<object> => {
  console.log(name);
  return await axios.get("http://test.com");
}