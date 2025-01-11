import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class MetaData {
  @ApiProperty({ example: 1 })
  page?: number;

  @ApiProperty({ example: 10 })
  size?: number;

  @ApiProperty({ example: 5 })
  totalPage?: number;

  @ApiProperty({ example: 50 })
  totalData?: number;
}

export class ApiResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty()
  data: T;

  @ApiProperty({ type: MetaData, required: false })
  metaData?: MetaData;

  @ApiProperty({ example: 200 })
  statusCode: number;

  constructor(
    success: boolean,
    message: string,
    data: T,
    statusCode: number,
    error?: string,
    metaData?: MetaData,
  ) {
    this.success = success;
    this.message = message;
    this.error = error
    this.data = data;
    this.statusCode = statusCode;
    this.metaData = metaData;
  }
}
