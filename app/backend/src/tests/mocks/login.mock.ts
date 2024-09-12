export const validLogin = {
    email: 'user@user.com',
    password: 'secret_user',
};

export const invalidLoginEmail = {
    email: '',
    password: 'secret_user',
};

export const invalidLoginPassword = {
    email: 'user@user.com',
    password: '',
};

export const notExistingUserBody = {
    email: 'test@test',
    password: 'secret_user',
};

export const invalidLogin = {
    email: 'test',
    password: 'ssda',
};