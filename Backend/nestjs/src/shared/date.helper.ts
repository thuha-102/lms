import { parse } from 'date-fns';

export const timeEponch = (value: string) => parse(value, 'dd-MM-yyyy', new Date()).valueOf();

export const parseEponch = (value: string | bigint | number) => {
  const date = new Date(Number(value));
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};
