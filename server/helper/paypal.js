import paypal from 'paypal-rest-sdk'

paypal.configure({
    mode : 'sandbox',
    client_id : 'AZMXzV4cKDqZUDZI1GyQTVF1MqHZxiyGTEccOfoC4scqckaR1V1BWPOSTZDMqP0eO1RdWsjlvzL0Z47o',
    client_secret : 'ECOCME4LnJrconnumzfk_nsA3OutUYY_lpVdk3gRpKjjf2v0NmsbLneQkcc68gkTr_Vaw8pdy9w8mwbR',
})

export default paypal;