import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class PaymentGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Web-socket is opened`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Web-socket is closed`);
    }

    @SubscribeMessage('paymnet')
    paymentConfirmed(receipt : {id: number, isPayment: boolean}) {
        this.server.emit('payment', receipt);
    }
}
