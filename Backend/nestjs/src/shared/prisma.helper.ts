export const removeRelation = () => ({ disconnect: true });
export const connectRelation = (value: number) => value && { connect: { id: value } };
export const connectManyRelation = (value: number[]) => value && { connect: value.map((id) => ({ id })) };
export const leanObject = (obj: { [key: string]: any }): { [key: string]: any } => {
  const newObj: { [key: string]: any } = {};

  for (const key in obj) {
    if (obj[key] || obj[key] === 0) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};
