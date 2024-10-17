import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/payment`;

class PaymentApi {
    async getAccountBank() {
        return axios.get(`${apiUrl}/bank-account`)
    }
}

export const paymentApi = new PaymentApi