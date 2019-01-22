import {USER_LOGIN} from '../constant'

export const authen = data =>{
  return {
    type: USER_LOGIN,
    payload: data
  }
}