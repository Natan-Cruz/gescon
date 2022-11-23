const sdk = require('api')('@voluti/v1.0#bm4h38l0mnc8fw');
sdk.auth('de0a601ff44748599f69b2970a6fab7e', 'NDU4MzMzNDYwMDAxMDk=');
sdk.server('https://api.weepay.com.br');

sdk.CriarcontaVoluti({
    name: 'Residencial Portal Dos Reis SPE',
    email: "douglaspiramide@hotmail.com",
    phoneNumber: null,
    website: null,
    description: null,
    statementDescriptor: null,
    document: '17189824000154',
    type: 'J',
    addressLine1: 'Av. Pres. Kennedy, 4030',
    addressLine2: '',
    neighborhood: 'Aviação',
    city: 'Praia Grande',
    state: 'SP',
    postalCode: '11703200',
    countryCode: 'BR',
    mcc: '90',
    checkingAccount: {
        type: 'J',
        customer: null,
        holderName: 'Residencial Portal Dos Reis SPE',
        document: '17189824000154',
        description: null,
        agency: 3856,
        accountNumber: '582-4',
        isActive: true,
        bank: {id: 5, name: 'Caixa Econômica Federal', code: '104'}
    },
    autoTransfer: true
})
  .then(res => console.log(res))
  .catch(err => console.error(err));