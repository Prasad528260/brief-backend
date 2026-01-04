import validator from 'validator';
import bcrypt from 'bcrypt';

export const validateSignup = ({email,password,name}) => {
    if(!email || !password || !name){
        return false;
    }
    if(!validator.isEmail(email)){
        return false;
    }
    if(!validator.isStrongPassword(password)){
        return false;
    }
    return true;
}

export const getHashedPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

export const comparePassword = (password,hashedPassword) => {
    return bcrypt.compareSync(password,hashedPassword);
}


export const validateLogin = ({email,password}) => {
    if (!email || !password) {
        return false;
    }
    if (!validator.isEmail(email)) {
        return false;
    }
    return true;
}