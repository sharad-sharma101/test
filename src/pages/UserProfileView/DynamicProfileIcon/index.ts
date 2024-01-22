import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

export const getRandomProfileIcon=(id:string)=>{
    const avatar = createAvatar(bottts, {
        seed: id,
        "backgroundColor": [
          "b6e3f4",
          "c0aede",
          "d1d4f9",
          "ffd5dc",
          "ffdfbf"
        ],
        radius:50
      });
      
      return avatar.toDataUriSync()
}


