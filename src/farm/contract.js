import store from "@/store/index"

export default class Contract {
  name = "";
  address = "";
  instance = null;

  constructor(name, address, abi) {
    this.name = name
      .toString()
      .toUpperCase()
      .trim();

    this.address = address;
    this.instance = new store.getters.getWeb3Instance.eth.Contract(abi, address);
  }
}
