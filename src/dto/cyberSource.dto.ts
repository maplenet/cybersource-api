import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsBoolean,
} from "class-validator";

export class CardInfoDTO {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  expirationMonth: string;

  @IsString()
  @IsNotEmpty()
  expirationYear: string;

  @IsString()
  @IsOptional()
  securityCode?: string;

  @IsString()
  @IsOptional()
  type?: string;

  constructor(
    number: string,
    expirationMonth: string,
    expirationYear: string
  ) {
    this.number = number;
    this.expirationMonth = expirationMonth;
    this.expirationYear = expirationYear;
  }
}

export class BillToDTO {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsString()
  @IsNotEmpty()
  administrativeArea: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  locality: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  constructor(
    firstName: string,
    lastName: string,
    address1: string,
    administrativeArea: string,
    country: string,
    locality: string,
    phoneNumber: string,
    email: string,
    postalCode: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address1 = address1;
    this.administrativeArea = administrativeArea;
    this.country = country;
    this.locality = locality;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.postalCode = postalCode;
  }
}

export class AmountDetailsDTO {
  @IsString()
  @IsNotEmpty()
  totalAmount: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  constructor(totalAmount: string, currency: string) {
    this.totalAmount = totalAmount;
    this.currency = currency;
  }
}

export class OrderInformationDTO {
  @IsObject()
  amountDetails: AmountDetailsDTO;

  @IsObject()
  billTo: BillToDTO;

  constructor(amountDetails: AmountDetailsDTO, billTo: BillToDTO) {
    this.amountDetails = amountDetails;
    this.billTo = billTo;
  }
}

export class ClientReferenceInformationDTO {
  @IsString()
  code: string;

  constructor(code: string) {
    this.code = code;
  }
}

export class PaymentInformationDTO {
  @IsObject()
  card: CardInfoDTO;

  constructor(card: CardInfoDTO) {
    this.card = card;
  }
}

export class ConsumerAuthenticationInformationAuthDTO {
  @IsString()
  @IsNotEmpty()
  referenceId: string;

  @IsString()
  @IsNotEmpty()
  returnUrl: string;

  @IsString()
  @IsNotEmpty()
  transactionMode: string;

  constructor(referenceId: string, returnUrl: string, transactionMode: string) {
    this.referenceId = referenceId;
    this.returnUrl = returnUrl;
    this.transactionMode = transactionMode;
  }
}

export class ConsumerAuthenticationInformationResultDTO {
  @IsString()
  @IsNotEmpty()
  authenticationTransactionId: string;

  @IsString()
  @IsOptional()
  status?: string;

  constructor(authenticationTransactionId: string) {
    this.authenticationTransactionId = authenticationTransactionId;
  }
}

export class ConsumerAuthenticationInformationPaymentDTO {
  @IsString()
  cavv: string;

  @IsString()
  xid: string;

  @IsString()
  ucafCollectionIndicator: string;

  @IsString()
  ucafAuthenticationData: string;

  @IsString()
  directoryServerTransactionId: string;

  @IsString()
  paSpecificationVersion: string;

  constructor(
    cavv: string,
    xid: string,
    ucafCollectionIndicator: string,
    ucafAuthenticationData: string,
    directoryServerTransactionId: string,
    paSpecificationVersion: string
  ) {
    this.cavv = cavv;
    this.xid = xid;
    this.ucafCollectionIndicator = ucafCollectionIndicator;
    this.ucafAuthenticationData = ucafAuthenticationData;
    this.directoryServerTransactionId = directoryServerTransactionId;
    this.paSpecificationVersion = paSpecificationVersion;
  }
}

export class ProcessingInformationDTO {
  @IsBoolean()
  capture: boolean;

  @IsString()
  commerceIndicator: string;

  constructor(capture: boolean, commerceIndicator: string) {
    this.capture = capture;
    this.commerceIndicator = commerceIndicator;
  }
}

export class BaseInformationDTO {
  @IsObject()
  clientReferenceInformation: ClientReferenceInformationDTO;

  @IsObject()
  paymentInformation: PaymentInformationDTO;

  @IsObject()
  orderInformation?: OrderInformationDTO;

  constructor(
    clientReferenceInformation: ClientReferenceInformationDTO,
    paymentInformation: PaymentInformationDTO,
    orderInformation?: OrderInformationDTO
  ) {
    this.clientReferenceInformation = clientReferenceInformation;
    this.paymentInformation = paymentInformation;
    this.orderInformation = orderInformation;
  }
}

export class AuthenticationDTO extends BaseInformationDTO {}

export class CreateAuthenticationDTO extends BaseInformationDTO {
  @IsObject()
  consumerAuthenticationInformation: ConsumerAuthenticationInformationAuthDTO;

  constructor(
    clientReferenceInformation: ClientReferenceInformationDTO,
    paymentInformation: PaymentInformationDTO,
    orderInformation: OrderInformationDTO,
    consumerAuthenticationInformation: ConsumerAuthenticationInformationAuthDTO
  ) {
    super(clientReferenceInformation, paymentInformation, orderInformation);
    this.consumerAuthenticationInformation = consumerAuthenticationInformation;
  }
}

export class GetAuthenticationResultDTO extends BaseInformationDTO {
  @IsObject()
  consumerAuthenticationInformation: ConsumerAuthenticationInformationResultDTO;

  constructor(
    clientReferenceInformation: ClientReferenceInformationDTO,
    paymentInformation: PaymentInformationDTO,
    orderInformation: OrderInformationDTO,
    consumerAuthenticationInformation: ConsumerAuthenticationInformationResultDTO
  ) {
    super(clientReferenceInformation, paymentInformation, orderInformation);
    this.consumerAuthenticationInformation = consumerAuthenticationInformation;
  }
}

export class ProcessPaymentDTO extends BaseInformationDTO {
  @IsObject()
  consumerAuthenticationInformation: ConsumerAuthenticationInformationPaymentDTO;

  @IsObject()
  processingInformation: ProcessingInformationDTO;

  constructor(
    clientReferenceInformation: ClientReferenceInformationDTO,
    processingInformation: ProcessingInformationDTO,
    paymentInformation: PaymentInformationDTO,
    orderInformation: OrderInformationDTO,
    consumerAuthenticationInformation: ConsumerAuthenticationInformationPaymentDTO
  ) {
    super(clientReferenceInformation, paymentInformation, orderInformation);
    this.consumerAuthenticationInformation = consumerAuthenticationInformation;
    this.processingInformation = processingInformation;
  }
}
