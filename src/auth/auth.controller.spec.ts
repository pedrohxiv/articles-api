import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { register: jest.fn(), login: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    validationPipe = new ValidationPipe();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw validation error if register email is empty', async () => {
    const registerDto = new RegisterDto();

    registerDto.email = '';
    registerDto.password = '123456';
    registerDto.username = 'user';

    await expect(
      validationPipe.transform(registerDto, {
        type: 'body',
        metatype: RegisterDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw validation error if register email is valid', async () => {
    const registerDto = new RegisterDto();

    registerDto.email = 'user.com';
    registerDto.password = '123456';
    registerDto.username = 'user';

    await expect(
      validationPipe.transform(registerDto, {
        type: 'body',
        metatype: RegisterDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw validation error if register password is empty', async () => {
    const registerDto = new RegisterDto();

    registerDto.email = 'user@mail.com';
    registerDto.password = '';
    registerDto.username = 'user';

    await expect(
      validationPipe.transform(registerDto, {
        type: 'body',
        metatype: RegisterDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw validation error if register username is empty', async () => {
    const registerDto = new RegisterDto();

    registerDto.email = 'user@mail.com';
    registerDto.password = '123456';
    registerDto.username = '';

    await expect(
      validationPipe.transform(registerDto, {
        type: 'body',
        metatype: RegisterDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw validation error if register username is valid', async () => {
    const registerDto = new RegisterDto();

    registerDto.email = 'user@mail.com';
    registerDto.password = '123456';
    registerDto.username = '$@&!%';

    await expect(
      validationPipe.transform(registerDto, {
        type: 'body',
        metatype: RegisterDto,
      }),
    ).rejects.toThrow(BadRequestException);

    registerDto.username = 'useruseruseruseruseruser';

    await expect(
      validationPipe.transform(registerDto, {
        type: 'body',
        metatype: RegisterDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should register a new user successfully', async () => {
    const registerDto = new RegisterDto();

    registerDto.email = 'user@mail.com';
    registerDto.password = '123456';
    registerDto.username = 'user';

    const expectedResult = {
      email: registerDto.email,
      username: registerDto.username,
      token: 'token',
    };

    jest.spyOn(service, 'register').mockResolvedValue(expectedResult);

    const result = await controller.register(registerDto);

    expect(result).toEqual(expectedResult);
    expect(service.register).toHaveBeenCalledWith(registerDto);
  });

  it('should throw validation error if login email is empty', async () => {
    const loginDto = new LoginDto();

    loginDto.email = '';
    loginDto.password = '123456';

    await expect(
      validationPipe.transform(loginDto, {
        type: 'body',
        metatype: LoginDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw validation error if login email is valid', async () => {
    const loginDto = new LoginDto();

    loginDto.email = 'user.com';
    loginDto.password = '123456';

    await expect(
      validationPipe.transform(loginDto, {
        type: 'body',
        metatype: LoginDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw validation error if login password is empty', async () => {
    const loginDto = new LoginDto();

    loginDto.email = 'user@mail.com';
    loginDto.password = '';

    await expect(
      validationPipe.transform(loginDto, {
        type: 'body',
        metatype: LoginDto,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should login a user successfully', async () => {
    const loginDto = new LoginDto();

    loginDto.email = 'user@mail.com';
    loginDto.password = '123456';

    const expectedResult = {
      token: 'token',
    };

    jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

    const result = await controller.login(loginDto);

    expect(result).toEqual(expectedResult);
    expect(service.login).toHaveBeenCalledWith(loginDto);
  });
});
