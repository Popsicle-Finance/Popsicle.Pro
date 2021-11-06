import axios from "axios";

const NODE_ENV = process.env.NODE_ENV;

// http://localhost:5001/v1
// https://back.popsicle.finance/v1
// http://ec2-18-197-77-215.eu-central-1.compute.amazonaws.com/api/v1

const urls = {
  0: "http://localhost:5001/v1",
  1: "http://ec2-18-197-77-215.eu-central-1.compute.amazonaws.com/api/v1",
  2: "https://back.popsicle.finance/v1",
};

const api = axios.create({
  baseURL: urls[2],
  headers: {
    "utopia-api-key":
      "7c0ebda1335239256127c483b206ebfeda5de7c7f52d504f3b518f4c67f3fa5deb952173c2c6341d47937531353561be8f1482d7f9af614710e0162838d80376092296175fedd5cbd9dd1d66b237c6e1e828a778981d865843809260be6e93e9da8541351e59c49861639f3c6ff3dcc84041ebc3b4339e52f298914622456d57eae0bf51fb7aefe4103f25ee27bfa8170fed5fec47b9b7bef3bdcd9e22f25332126291aac47503b6d5ed37babc6a0be5482a430d5147283688c4d66f29741a0a96879477a3586241add65482a7f05bc0e6515e8f1a556665b92bff2fd2f3dc05cccb19d059d9c1ffa6d36d05fee71c114dc7e30a2fabb53c33ff3bd959f49ce8",
  },
});

// Application
export const SendApplication = async (application) => {
  try {
    const data = api.post("/requests", application);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const InitWallet = async (address) => {
  try {
    const addr = address ? address : localStorage.getItem(address);

    if (addr) {
      const { data } = await api.post("/wallet", {
        address: addr,
      });
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const GetWallet = async (address) => {
  try {
    if (address) {
      const addr = address ? address : localStorage.getItem("address");

      const { data } = await api.get(`/wallet/${addr}`);

      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

export const CreateProposal = async (address, params) => {
  try {
    const { data } = await api.post(`/wallet/${address}/proposal`, {
      blocks: params.blocks,
      category: params.category,
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const GetProposal = async (address) => {
  try {
    const { data } = await api.get(`/proposals?address=${address}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GetCurrentProposal = async (id) => {
  try {
    const { data } = await api.get(`/proposals/${id}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const SupportProposal = async (id, address, signature, message) => {
  try {
    const { data } = await api.post(`/proposals/${id}/support`, {
      address,
      signature,
      message,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const ApproveVote = async (id, address, signature, message) => {
  try {
    const { data } = await api.post(`/proposals/${id}/approve`, {
      address,
      signature,
      message,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const RejectVote = async (id, address, signature, message) => {
  try {
    const { data } = await api.post(`/proposals/${id}/reject`, {
      address,
      signature,
      message,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const SendComment = async (id, address, message) => {
  try {
    const { data } = await api.post(`/proposals/${id}/comment`, {
      address,
      message,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
