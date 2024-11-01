import axios from 'axios';

const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/payment`;

class PaymentApi {
    createBankAccount(request){
        return axios.post(`${apiUrl}/bank-account`, request)
    }

    getAccountBank() {
        return axios.get(`${apiUrl}/bank-account`)
    }

    createReceipt(learnerId, courseIds){
        return axios.post(`${apiUrl}/receipt`, {learnerId, courseIds})
    }

    getReceipts(learnerName, isPayment){
        console.log(learnerName, isPayment);
        if (!learnerName && !isPayment) return axios.get(`${apiUrl}/receipt`);

        if(!learnerName) return axios.get(`${apiUrl}/receipt?isPayment=${isPayment}`);
        if(!isPayment) return axios.get(`${apiUrl}/receipt?learnerName=${learnerName}`);

        return axios.get(`${apiUrl}/receipt?isPayment=${isPayment}&learnerName=${learnerName}`);
    }

    updateAccountbank(request) {
        return axios.patch(`${apiUrl}/bank-account`, request)
    }
}

export const paymentApi = new PaymentApi();