import { v1 as uuid } from 'uuid'

const generateId = () => {
   return  uuid().slice(0, 4);
}

export default generateId;